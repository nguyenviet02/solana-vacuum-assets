import { Nft, Sft, SftWithToken, NftWithToken } from '@metaplex-foundation/js'

export type TTokenData = {
  mintAddress: string
  tokenBalance: number
  tokenSymbol: string | undefined
	decimals: number
}

export type TTokenMetadata = Sft | SftWithToken | Nft | NftWithToken | null

export enum SORT_TYPE {
  ASC = 'ascending',
  DESC = 'descending',
}

export enum SORT_BY {
  SYMBOL = 'symbol',
  BALANCE = 'balance',
  SCOOP_VALUE = 'scoop-value',
}

export type TFilterData = {
  symbol: string
  isSort: boolean
  sortBy: string
  sortType: SORT_TYPE
}
