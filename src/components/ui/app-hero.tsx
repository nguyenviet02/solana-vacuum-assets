export function AppHero() {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-[#3D83F0] to-[#02D0DE] bg-clip-text text-transparent">
            Solana Vacuum Assets
          </h1>
          <p className="pt-6 text-secondary">
            Airdrops and advertisements can spam your wallet. This tool enables you to quickly vacuum up all your
            unwanted assets and convert them into $CAT (Simon's Cat) via Jupiter swaps.
          </p>
          <p className="text-secondary">
            * If the swap cannot be executed, the token account and its balance will be burned. DYOR !!!
          </p>
        </div>
      </div>
    </div>
  )
}
