import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { AccountTokens, AccountTransactions } from './account-ui'

export default function AccountDetailFeature() {
  const params = useParams() as { address?: string }
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
  }

  return (
    <div>
      <div className="space-y-8">
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  )
}
