import { Nft, Sft, SftWithToken, NftWithToken } from '@metaplex-foundation/js'

export type TTokenData = {
  mintAddress: string
  tokenBalance: number
  tokenSymbol: string | undefined
}

export type TTokenMetadata = Sft | SftWithToken | Nft | NftWithToken | null
