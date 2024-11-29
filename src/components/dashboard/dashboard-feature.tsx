import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/ui-layout'

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="gm" subtitle="Say hi to your new Solana dApp." />
      <WalletButton />
    </div>
  )
}
