import { WalletError } from '@solana/wallet-adapter-base'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo } from 'react'

import('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = WalletMultiButton

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = 'https://attentive-wispy-lambo.solana-mainnet.quiknode.pro/7ebe538ec592abd29465295d78136b34bb60f386'
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new LedgerWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
