import WalletConnect from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { hexValue } from 'ethers/lib/utils';

import { Eip1193Provider, EthereumProvider } from '@/services/web3-provider';

export async function createWalletConnectProvider(rpcList: {
  [chainId: string]: string;
}): Promise<WalletConnectProvider | undefined> {
  const provider = new WalletConnect({
    rpc: rpcList,
  });

  await provider.enable();

  if (provider.connected) {
    const walletConnectProvider = new WalletConnectProvider(provider);
    await walletConnectProvider.init();
    return walletConnectProvider;
  }

  return undefined;
}

export class WalletConnectProvider extends EthereumProvider {
  constructor(_provider: Eip1193Provider) {
    super(_provider);
  }

  async switchChain(newChainId: number): Promise<boolean | null> {
    const newChainIdHex = hexValue(newChainId);
    try {
      await this.web3Provider.send('wallet_switchEthereumChain', [{ chainId: newChainIdHex }]);
      return true;
    } catch (switchError: unknown) {
      if ((switchError as Error).message == 'User rejected the request.') throw switchError;
      return null;
    }
  }
}
