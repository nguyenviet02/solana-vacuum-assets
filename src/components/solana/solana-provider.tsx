import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo } from 'react'
import { clusterApiUrl } from '@solana/web3.js'

import('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = WalletMultiButton

export function SolanaProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new LedgerWalletAdapter()], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
