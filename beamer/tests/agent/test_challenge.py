import os
import time
from datetime import datetime

import ape
import pytest
import structlog
from eth_utils import to_checksum_address
from eth_utils.hexadecimal import encode_hex
from freezegun import freeze_time
from web3.constants import ADDRESS_ZERO

import beamer.agent.agent
from beamer.agent.chain import get_l1_cost
from beamer.tests.constants import FILL_ID
from beamer.tests.util import (
    EventCollector,
    HTTPProxy,
    Sleeper,
    alloc_accounts,
    alloc_whitelisted_accounts,
    earnings,
    jump_to_challenge_phase,
    make_request,
)


@pytest.fixture(scope="module", autouse=True)
def _allow_unlisted_pairs():
    old = os.environ.get("BEAMER_ALLOW_UNLISTED_PAIRS")
    os.environ["BEAMER_ALLOW_UNLISTED_PAIRS"] = "1"
    yield
    if old is None:
        del os.environ["BEAMER_ALLOW_UNLISTED_PAIRS"]
    else:
        os.environ["BEAMER_ALLOW_UNLISTED_PAIRS"] = old


@pytest.fixture(scope="module", autouse=True)
def _set_gas_price():
    ape.chain.provider.web3.provider.make_request(
        "miner_setGasPrice", [ape.convert("1 gwei", int)]
    )
    yield
    ape.chain.provider.web3.provider.make_request("miner_setGasPrice", [0])


# Scenario 1:
#
# Bob              Charlie
# --------------------------
# claim
#                  challenge
#
# Winner: Charlie
def test_challenge_1(request_manager, token, config):
    requester, charlie, target = alloc_accounts(3)

    agent = beamer.agent.agent.Agent(config)
    agent.start()

    w3 = ape.chain.provider.web3
    with earnings(w3, agent) as agent_earnings, earnings(w3, charlie) as charlie_earnings:
        token.approve(request_manager, 1, sender=agent.address)
        make_request(request_manager, token, requester, target, 1, fee_data="standard")

        collector = EventCollector(request_manager, "ClaimMade")

        claim = collector.next_event()
        assert claim is not None

        agent.stop()
        agent.wait()

        request_manager.challengeClaim(claim.claimId, sender=charlie, value=claim.claimerStake + 1)
        claim = collector.next_event()
        assert claim is not None
        ape.chain.mine(timestamp=claim.termination)
        request_manager.withdraw(claim.claimId, sender=charlie)

    assert charlie_earnings() == claim.claimerStake
    assert agent_earnings() == -claim.claimerStake


# Scenario 2:
#
# Bob              Charlie
# --------------------------
# claim
#                  challenge
# challenge
#
# Winner: Bob
def test_challenge_2(request_manager, token, config, direction, finality_period):
    requester, charlie, target = alloc_accounts(3)

    agent = beamer.agent.agent.Agent(config)
    agent.start()

    w3 = ape.chain.provider.web3

    with earnings(w3, agent) as agent_earnings, earnings(w3, charlie) as charlie_earnings:
        token.approve(request_manager, 1, sender=agent.address)
        request_id = make_request(
            request_manager, token, requester, target, 1, fee_data="standard"
        )

        collector = EventCollector(request_manager, "ClaimMade")

        claim = collector.next_event()
        assert claim is not None

        request_manager.challengeClaim(claim.claimId, sender=charlie, value=claim.claimerStake + 1)

        # Charlies challenge.
        claim_event = collector.next_event()
        assert claim_event is not None
        assert claim_event.claimerStake < claim_event.challengerStakeTotal

        with Sleeper(5) as sleeper:
            while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
                sleeper.sleep(0.1)

        with Sleeper(5) as sleeper:
            while (request := agent.get_context(direction).requests.get(request_id)) is None:
                sleeper.sleep(0.1)

        with jump_to_challenge_phase(request.fill_timestamp, finality_period):
            # Bob's challenge.
            claim = collector.next_event()
            assert claim is not None
            assert claim.claimerStake > claim.challengerStakeTotal

            ape.chain.mine(timestamp=claim.termination)
            request_manager.withdraw(claim.claimId, sender=agent.address)

        agent.stop()
        agent.wait()
    assert agent_earnings() == claim.challengerStakeTotal
    assert charlie_earnings() == -claim.challengerStakeTotal


# Scenario 3:
#
# Bob              Charlie
# --------------------------
#                  claim
# challenge
#
# Winner: Bob
#
# Note: Bob is not filling the request here, merely noticing the dishonest
# claim and challenging it.
def test_challenge_3(request_manager, fill_manager, token, config, direction, finality_period):
    requester, target = alloc_accounts(2)
    (charlie,) = alloc_whitelisted_accounts(1, [request_manager])
    agent = beamer.agent.agent.Agent(config)

    w3 = ape.chain.provider.web3
    with earnings(w3, agent) as agent_earnings, earnings(w3, charlie) as charlie_earnings:
        # Submit a request that Bob cannot fill.
        amount = token.balanceOf(agent.address) + 1
        request_id = make_request(
            request_manager, token, requester, target, amount, fee_data="standard"
        )

        stake = request_manager.claimStake()
        request_manager.claimRequest(request_id, FILL_ID, sender=charlie, value=stake)

        collector = EventCollector(request_manager, "ClaimMade")
        claim_event = collector.next_event()

        assert claim_event is not None

        agent.start()

        with Sleeper(5) as sleeper:
            while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
                sleeper.sleep(0.1)

        with Sleeper(5) as sleeper:
            while claim.invalidation_timestamp is None:
                sleeper.sleep(0.1)

        with jump_to_challenge_phase(claim.invalidation_timestamp, finality_period):
            # Get Bob's challenge.
            claim = collector.next_event()
            assert claim is not None
            assert (
                claim.challengerStakeTotal > claim.claimerStake
                and claim.lastChallenger == agent.address
            )

        # Ensure that Bob did not fill the request.
        assert EventCollector(fill_manager, "RequestFilled").next_event(wait_time=2) is None

        ape.chain.mine(timestamp=claim.termination)
        request_manager.withdraw(claim.claimId, sender=agent.address)

        agent.stop()
        agent.wait()

    assert agent_earnings() == claim.claimerStake
    assert charlie_earnings() == -claim.claimerStake


# Scenario 4:
#
# Bob              Charlie
# --------------------------
#                  claim
# challenge
#                  challenge
#
# Winner: Charlie
#
# Note: Bob is not filling the request here, merely noticing the dishonest
# claim and challenging it.
def test_challenge_4(request_manager, fill_manager, token, config, direction, finality_period):
    requester, target = alloc_accounts(2)
    (charlie,) = alloc_whitelisted_accounts(1, [request_manager])
    agent = beamer.agent.agent.Agent(config)

    w3 = ape.chain.provider.web3
    with earnings(w3, agent) as agent_earnings, earnings(w3, charlie) as charlie_earnings:
        # Submit a request that Bob cannot fill.
        amount = token.balanceOf(agent.address) + 1
        request_id = make_request(
            request_manager, token, requester, target, amount, fee_data="standard"
        )

        stake = request_manager.claimStake()
        request_manager.claimRequest(request_id, FILL_ID, sender=charlie, value=stake)
        collector = EventCollector(request_manager, "ClaimMade")
        claim_event = collector.next_event()

        assert claim_event is not None

        agent.start()

        with Sleeper(5) as sleeper:
            while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
                sleeper.sleep(0.1)

        with Sleeper(5) as sleeper:
            while claim.invalidation_timestamp is None:
                sleeper.sleep(0.1)

        with jump_to_challenge_phase(claim.invalidation_timestamp, finality_period):
            # Get Bob's challenge.
            claim = collector.next_event()
            assert claim is not None
            assert (
                claim.challengerStakeTotal > claim.claimerStake
                and claim.lastChallenger == agent.address
            )

        # Ensure that Bob did not fill the request.
        assert EventCollector(fill_manager, "RequestFilled").next_event(wait_time=2) is None

        agent.stop()
        agent.wait()

        request_manager.challengeClaim(
            claim.claimId, sender=charlie, value=claim.challengerStakeTotal + 1
        )

        claim = collector.next_event()
        assert claim is not None
        assert claim.claimerStake > claim.challengerStakeTotal and claim.claimer == charlie

        ape.chain.mine(timestamp=claim.termination)
        request_manager.withdraw(claim.claimId, sender=charlie)

    assert agent_earnings() == -claim.challengerStakeTotal
    assert charlie_earnings() == claim.challengerStakeTotal


# Scenario 5:
#
# Bob              Charlie
# --------------------------
#                  fill (if honest)
#                  claim
#
# ....fill_wait_time....
#
# challenge (if not honest)
#
#
# Note: This test tests if Bob waits `fill_wait_time` seconds before challenging
# a dishonest claim
@pytest.mark.parametrize("honest_claim", [True, False])
def test_challenge_5(
    request_manager, fill_manager, token, config, honest_claim, direction, finality_period
):
    requester, target = alloc_accounts(2)
    (charlie,) = alloc_whitelisted_accounts(1, [request_manager, fill_manager])
    config.fill_wait_time = 5

    agent = beamer.agent.agent.Agent(config)
    agent.start()

    # Submit a request that Bob cannot fill.
    amount = token.balanceOf(agent.address) + 1
    request_id = make_request(
        request_manager, token, requester, target, amount, fee_data="standard"
    )
    # FIXME: Nonce is one because it was the only request created
    # ideally we should get it from the event which is dropped by make_request()
    nonce = 1
    fill_id = FILL_ID
    with ape.accounts.test_accounts.use_sender(charlie):
        if honest_claim:
            # Fill by Charlie
            token.mint(charlie, amount)
            token.approve(fill_manager, amount)
            fill_transaction = fill_manager.fillRequest(
                ape.chain.chain_id,
                token,
                target,
                amount,
                nonce,
            )
            fill_id = fill_transaction.return_value

        # claim by Charlie
        stake = request_manager.claimStake()
        request_manager.claimRequest(request_id, fill_id, value=stake)

    collector = EventCollector(request_manager, "ClaimMade")
    claim_event = collector.next_event()
    assert claim_event is not None

    with Sleeper(10) as sleeper:
        while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
            sleeper.sleep(0.1)

    # Wait just before the challenge back off time
    time.sleep(config.fill_wait_time - 1)

    # Regardless of the honesty of the claim there should be no challenge event
    claim_event = collector.next_event(0.1)
    assert claim_event is None
    if honest_claim:
        claim = collector.next_event(20)
        assert claim is None
    else:
        with Sleeper(5) as sleeper:
            while claim.invalidation_timestamp is None:
                sleeper.sleep(0.1)

        with jump_to_challenge_phase(claim.invalidation_timestamp, finality_period):
            claim = collector.next_event(20)
            # Challenge expected
            assert claim is not None
            assert claim.lastChallenger == to_checksum_address(agent.address)

    agent.stop()
    agent.wait()


# Scenario 6:
#
# Charlie          Dave
# --------------------------
# claim
#                  challenge
#
# Winner: Charlie
#
# Note: Bob is not participating in the challenge here. We test whether Bob
# will attempt to withdraw the stakes in place of Dave.
def test_withdraw_not_participant(request_manager, token, config):
    requester, dave, target = alloc_accounts(3)
    (charlie,) = alloc_whitelisted_accounts(1, [request_manager])
    agent = beamer.agent.agent.Agent(config)

    # Submit a request that Bob cannot fill.
    amount = token.balanceOf(agent.address) + 1
    request_id = make_request(
        request_manager, token, requester, target, amount, fee_data="standard"
    )

    stake = request_manager.claimStake()
    request_manager.claimRequest(request_id, FILL_ID, sender=charlie, value=stake)

    collector = EventCollector(request_manager, "ClaimMade")
    claim = collector.next_event()
    assert claim is not None

    request_manager.challengeClaim(claim.claimId, sender=dave, value=stake + 1)
    ape.chain.mine(timestamp=claim.termination)

    agent.start()

    # We wait enough time for agent to potentially withdraw
    collector = EventCollector(request_manager, "ClaimStakeWithdrawn")
    withdraw_event = collector.next_event(wait_time=2)
    assert withdraw_event is None

    agent.stop()
    agent.wait()


# Scenario 7:
#
# Bob              Charlie              Dave
# -----------------------------------------------
#                  claim
#                                       challenge
#                  challenge
# challenge
# Winner: Bob + Dave
#
# Note: testing that the agent can handle multiparty bidding
def test_challenge_7(request_manager, fill_manager, token, config, direction, finality_period):
    requester, dave, target = alloc_accounts(3)
    (charlie,) = alloc_whitelisted_accounts(1, [request_manager])
    agent = beamer.agent.agent.Agent(config)

    w3 = ape.chain.provider.web3
    with earnings(w3, agent) as agent_earnings, earnings(w3, dave) as dave_earnings:
        # Submit a request that Bob cannot fill.
        amount = token.balanceOf(agent.address) + 1
        request_id = make_request(request_manager, token, requester, target, amount)

        stake = request_manager.claimStake()
        request_manager.claimRequest(request_id, FILL_ID, sender=charlie, value=stake)

        collector = EventCollector(request_manager, "ClaimMade")
        claim = collector.next_event()
        assert claim is not None

        # Dave challenges
        request_manager.challengeClaim(claim.claimId, sender=dave, value=claim.claimerStake + 1)

        claim = collector.next_event()
        assert claim is not None

        agent.start()

        # Ensure that Bob did not fill the request.
        assert EventCollector(fill_manager, "RequestFilled").next_event(wait_time=2) is None

        request_manager.challengeClaim(claim.claimId, sender=charlie, value=stake + 1)

        claim_event = collector.next_event()
        assert claim_event is not None
        assert (
            claim_event.claimerStake > claim_event.challengerStakeTotal
            and claim_event.claimer == charlie
        )

        with Sleeper(10) as sleeper:
            while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
                sleeper.sleep(0.1)

        with Sleeper(5) as sleeper:
            while claim.invalidation_timestamp is None:
                sleeper.sleep(0.1)

        with jump_to_challenge_phase(claim.invalidation_timestamp, finality_period):
            # Get Bob's challenge.
            claim = collector.next_event()
            assert claim is not None
            assert (
                claim.challengerStakeTotal > claim.claimerStake
                and claim.lastChallenger == agent.address
            )

        ape.chain.mine(timestamp=claim.termination)

        request_manager.withdraw(claim.claimId, sender=agent.address)
        request_manager.withdraw(claim.claimId, sender=dave)

        agent.stop()
        agent.wait()

    assert agent_earnings() == stake
    assert dave_earnings() == stake + 1


@pytest.mark.usefixtures("setup_relayer_executable")
def test_l1_resolution(request_manager, token, l1_messenger, agent, direction, chain_params):
    requester, target, exploiter = alloc_accounts(3)
    ape.accounts.test_accounts[0].transfer(exploiter, ape.convert("10 ether", int))
    amount = 1

    new_chain_params = (1, *chain_params[1:])
    request_manager.updateChain(ape.chain.chain_id, *new_chain_params)

    request_id = make_request(request_manager, token, requester, target, amount)

    with Sleeper(5) as sleeper:
        while (request := agent.get_context(direction).requests.get(request_id)) is None:
            sleeper.sleep(0.1)

    with Sleeper(5) as sleeper:
        while not request.claimed.is_active:
            sleeper.sleep(0.1)

    collector = EventCollector(request_manager, "ClaimMade")
    claim = collector.next_event()

    assert claim is not None

    # challenge with enough to go to l1
    request_manager.challengeClaim(
        claim.claimId, sender=exploiter, value=ape.convert("2 ether", int)
    )

    with Sleeper(5) as sleeper:
        while agent.get_context(direction).l1_resolutions.get(request.fill_tx) is None:
            sleeper.sleep(0.1)

    ape.chain.provider.web3.provider.make_request(
        "evm_setAccountBalance",
        [l1_messenger.address, encode_hex(str(ape.convert("1 ether", int)))],
    )

    request_manager.resolveRequest(
        request_id, request.fill_id, ape.chain.chain_id, ADDRESS_ZERO, sender=l1_messenger
    )

    with Sleeper(5) as sleeper:
        while not request.l1_resolved.is_active:
            sleeper.sleep(0.1)


@pytest.mark.usefixtures("setup_relayer_executable")
def test_invalidation(
    request_manager, fill_manager, token, l1_messenger, agent, direction, chain_params
):
    agent_balance = token.balanceOf(agent.address)

    requester, target = alloc_accounts(2)
    (exploiter,) = alloc_whitelisted_accounts(1, [request_manager, fill_manager])
    ape.accounts.test_accounts[0].transfer(
        exploiter, ape.convert("10 ether", int)
    )  # exploiter has much more funds
    amount = agent_balance + 1

    new_chain_params = (1, *chain_params[1:])
    request_manager.updateChain(ape.chain.chain_id, *new_chain_params)

    request_id = make_request(request_manager, token, requester, target, amount)

    stake = request_manager.claimStake()
    claim_id = request_manager.claimRequest(
        request_id, FILL_ID, sender=exploiter, value=stake
    ).return_value

    with Sleeper(5) as sleeper:
        while (claim := agent.get_context(direction).claims.get(claim_id)) is None:
            sleeper.sleep(0.1)

    with Sleeper(10) as sleeper:
        while not claim.challenger_winning.is_active:
            sleeper.sleep(0.1)

    # challenge with enough to go to l1
    request_manager.challengeClaim(claim_id, sender=exploiter, value=ape.convert("2 ether", int))

    with Sleeper(5) as sleeper:
        while agent.get_context(direction).l1_resolutions.get(claim.invalidation_tx) is None:
            sleeper.sleep(0.1)

    ape.chain.provider.web3.provider.make_request(
        "evm_setAccountBalance",
        [l1_messenger.address, encode_hex(str(ape.convert("1 ether", int)))],
    )

    request_manager.invalidateFill(request_id, FILL_ID, ape.chain.chain_id, sender=l1_messenger)

    ape.chain.mine(timestamp=claim.termination + 100)
    with Sleeper(5) as sleeper:
        while not claim.withdrawn.is_active:
            sleeper.sleep(0.1)


def _do_post(handler, url, post_body):
    response = handler.forward_request(url, post_body)
    if response is not None:
        handler.complete(response)


@pytest.mark.usefixtures("setup_relayer_executable")
def test_rpc_down_on_challenge(request_manager, token, config, direction, chain_params):
    proxy_l2a = HTTPProxy(config.rpc_urls["l2a"], _do_post)
    proxy_l2a.start()
    config.rpc_urls["l2a"] = proxy_l2a.url()

    agent = beamer.agent.agent.Agent(config)
    agent.start()

    requester, target, exploiter = alloc_accounts(3)
    ape.accounts.test_accounts[0].transfer(exploiter, ape.convert("10 ether", int))
    amount = 1

    new_chain_params = (1, *chain_params[1:])
    request_manager.updateChain(ape.chain.chain_id, *new_chain_params)

    request_id = make_request(request_manager, token, requester, target, amount)

    with Sleeper(5) as sleeper:
        while (request := agent.get_context(direction).requests.get(request_id)) is None:
            sleeper.sleep(0.1)

    with Sleeper(10) as sleeper:
        while not request.claimed.is_active:
            sleeper.sleep(0.1)

    collector = EventCollector(request_manager, "ClaimMade")
    claim = collector.next_event()

    assert claim is not None
    with structlog.testing.capture_logs() as captured_logs:
        proxy_l2a.stop()
        ape.chain.mine(200)
        request_manager.challengeClaim(
            claim.claimId, sender=exploiter, value=ape.convert("0.00125 ether", int)
        )

        exploiter_claim = collector.next_event()

        assert exploiter_claim is not None

        # as agent lost the RPC connection, it couldn't counter-challenge because the event
        # processor is halted
        challenge_claim = collector.next_event()

        assert challenge_claim is None

        proxy_l2a.start()

        # as agent has the RPC connection again, start processing events and counter challenge
        challenge_claim = collector.next_event()

        assert challenge_claim is not None

        agent.stop()
        proxy_l2a.stop()

    stop_log = next(log for log in captured_logs if log["event"] == "RPC stopped working")
    start_log = next(log for log in captured_logs if log["event"] == "RPC started working")

    assert captured_logs.index(stop_log) + 2 == captured_logs.index(start_log)


@pytest.mark.usefixtures("setup_relayer_executable")
def test_avoid_draining_agent_funds(
    request_manager, token, agent, direction, chain_params, finality_period, l1_messenger
):
    requester, target, exploiter = alloc_accounts(3)
    ape.accounts.test_accounts[0].transfer(exploiter, ape.convert("10 ether", int))
    amount = 1

    new_chain_params = (1, *chain_params[1:])
    request_manager.updateChain(ape.chain.chain_id, *new_chain_params)

    request_id = make_request(request_manager, token, requester, target, amount)

    with Sleeper(5) as sleeper:
        while (request := agent.get_context(direction).requests.get(request_id)) is None:
            sleeper.sleep(0.1)

    collector = EventCollector(request_manager, "ClaimMade")
    claim_event = collector.next_event()

    assert claim_event is not None

    with Sleeper(5) as sleeper:
        while (claim := agent.get_context(direction).claims.get(claim_event.claimId)) is None:
            sleeper.sleep(0.1)

    with freeze_time(datetime.fromtimestamp(1), tick=True):
        request_manager.challengeClaim(
            claim.id, sender=exploiter, value=claim_event.claimerStake + 1
        )

        exploiter_claim = collector.next_event()
        assert exploiter_claim is not None

        # message is not finalized, dont challenge
        challenge_claim = collector.next_event()
        assert challenge_claim is None

    l1_cost = get_l1_cost(agent.get_context(direction))

    with jump_to_challenge_phase(request.fill_timestamp, finality_period):
        # message finalized, challenge
        assert int(time.time()) > finality_period + request.fill_timestamp
        challenge_claim = collector.next_event()
        assert challenge_claim is not None

        # preparing for l1
        assert challenge_claim.claimerStake > l1_cost

        request_manager.challengeClaim(
            claim.id, sender=exploiter, value=challenge_claim.claimerStake + 1
        )

        exploiter_claim = collector.next_event()
        assert exploiter_claim is not None

        # l1 costs are staked by exploiter, so don't challenge again
        new_claim = collector.next_event()
        assert new_claim is None

        # l1 called by agent
        with Sleeper(5) as sleeper:
            while agent.get_context(direction).l1_resolutions.get(request.fill_tx) is None:
                sleeper.sleep(0.1)

        ape.chain.provider.web3.provider.make_request(
            "evm_setAccountBalance",
            [l1_messenger.address, encode_hex(str(ape.convert("1 ether", int)))],
        )

        request_manager.resolveRequest(
            request_id, request.fill_id, ape.chain.chain_id, ADDRESS_ZERO, sender=l1_messenger
        )

        with Sleeper(5) as sleeper:
            while not request.l1_resolved.is_active:
                sleeper.sleep(0.1)
