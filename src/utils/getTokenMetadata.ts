import { Metaplex } from '@metaplex-foundation/js'
import { Connection, PublicKey } from '@solana/web3.js'
import { ENV, TokenListProvider } from '@solana/spl-token-registry'
import { TTokenMetadata } from '@/types'

async function getTokenMetadataByMint(connection: Connection, tokenMint: string) {
  let tokenMetadata: TTokenMetadata = null
  const metaplex = Metaplex.make(connection)

  const mintAddress = new PublicKey(tokenMint)

  const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress })

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount)

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress })
    tokenMetadata = token
  } else {
    const provider = await new TokenListProvider().resolve()
    const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList()
    const tokenMap = tokenList.reduce((map, item) => {
      map.set(item.address, item)
      return map
    }, new Map())

    const token = tokenMap.get(mintAddress.toBase58())

    tokenMetadata = token
  }

  return tokenMetadata
}

export default getTokenMetadataByMint
