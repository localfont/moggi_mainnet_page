'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AddToMetaMask() {
  const [isAdding, setIsAdding] = useState(false);

  const addMonadNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsAdding(true);

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x8F', // 143 in hex
            chainName: 'Monad Mainnet',
            nativeCurrency: {
              name: 'Monad',
              symbol: 'MON',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-mainnet.monadinfra.com/rpc/0W06akV4NIjKEB8yoapOZDjauxHicBxB'],
            blockExplorerUrls: ['https://mainnet.moggi.tools'],
          },
        ],
      });

      alert('Monad Mainnet has been added to MetaMask!');
    } catch (error: any) {
      console.error('Error adding Monad network:', error);

      if (error.code === 4001) {
        // User rejected the request
        alert('You rejected the network addition.');
      } else {
        alert(`Error adding Monad network: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={addMonadNetwork}
      disabled={isAdding}
      variant="outline"
    >
      {isAdding ? 'Adding...' : 'Add to MetaMask'}
    </Button>
  );
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
