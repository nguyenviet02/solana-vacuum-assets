import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/app-hero'

export default function DashboardFeature() {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <AppHero />
      <WalletButton />
    </div>
  )
}
