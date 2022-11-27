import { hexValue } from 'ethers/lib/utils';

import type { Eip1193Provider } from '@/services/web3-provider';
import { EthereumProvider } from '@/services/web3-provider';
import { WalletConnect } from '@/services/web3-provider/util-export';

export async function createWalletConnectProvider(rpcList: {
  [chainId: string]: string;
}): Promise<WalletConnectProvider | undefined> {
  const provider = new WalletConnect({
    rpc: rpcList,
  }) as Eip1193Provider & typeof WalletConnect;

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

  protected async switchChain(newChainId: number): Promise<boolean> {
    const newChainIdHex = hexValue(newChainId);
    try {
      await this.web3Provider.send('wallet_switchEthereumChain', [{ chainId: newChainIdHex }]);
      return true;
    } catch (error: unknown) {
      if ((error as Error).message.startsWith('Unrecognized chain ID')) {
        return false;
      }
      throw error;
    }
  }
}
