import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import ScoopTable from './scoop-table'
import ScoopTool from './scoop-tool'
import { useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import getTokenMetadataByMint from '@/utils/getTokenMetadata'
import { SORT_BY, SORT_TYPE, TFilterData, TTokenData } from '@/types'
import ScoopFilter from './scoop-filter'

const Scoop = () => {
  const connection = useConnection()
  const wallet = useWallet()
  const walletToQuery = useMemo(() => {
    return wallet?.publicKey?.toString() || ''
  }, [wallet])

  const [isLoadingTokenData, setIsLoadingTokenData] = useState(true)
  const [defaultListTokenData, setDefaultListTokenData] = useState<TTokenData[]>([])
  const [listTokenData, setListTokenData] = useState<TTokenData[]>([])
  const [isShowTool, setIsShowTool] = useState(false)

  const [filterData, setFilterData] = useState<TFilterData>({
    symbol: '',
    isSort: false,
    sortBy: SORT_BY.SYMBOL,
    sortType: SORT_TYPE.ASC,
  })

  const [selectedToken, setSelectedToken] = useState<TTokenData[]>([])

  async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
    setIsLoadingTokenData(true)
    const listToken: TTokenData[] = []
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: wallet, //our search criteria, a base58 encoded string
        },
      },
    ]
    const accounts = await solanaConnection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters: filters })
    for (const account of accounts) {
      //Parse the account data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedAccountInfo: any = account.account.data
      const mintAddress: string = parsedAccountInfo['parsed']['info']['mint']
      const tokenBalance: number = parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
      if (tokenBalance === 0) continue
      const tokenMetadata = await getTokenMetadataByMint(solanaConnection, mintAddress)
      const tokenData = {
        mintAddress,
        tokenBalance,
        tokenSymbol: tokenMetadata?.symbol,
        decimals: tokenMetadata?.mint?.decimals || 6,
      }
      listToken.push(tokenData)
    }
    setListTokenData(listToken)
    setDefaultListTokenData(listToken)
    setIsLoadingTokenData(false)
  }

  useEffect(() => {
    if (!connection || !walletToQuery) return
    getTokenAccounts(walletToQuery, connection?.connection)
  }, [connection, walletToQuery])

  useEffect(() => {
    if (walletToQuery === '') {
      setIsShowTool(false)
      return
    }
    setIsShowTool(true)
  }, [walletToQuery])

  useEffect(() => {
    if (!filterData.isSort) {
      return
    }
    const sortedData = [...listTokenData].sort((a, b) => {
      if (filterData.sortBy === SORT_BY.SYMBOL) {
        return filterData.sortType === SORT_TYPE.ASC
          ? (a.tokenSymbol?.localeCompare(b.tokenSymbol!) ?? 0)
          : (b.tokenSymbol?.localeCompare(a.tokenSymbol!) ?? 0)
      }
      if (filterData.sortBy === SORT_BY.BALANCE) {
        return filterData.sortType === SORT_TYPE.ASC ? a.tokenBalance - b.tokenBalance : b.tokenBalance - a.tokenBalance
      }
      return 0
    })
    setListTokenData(sortedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.isSort, filterData.sortBy, filterData.sortType])

  useEffect(() => {
    if (filterData.symbol === '') {
      setListTokenData(defaultListTokenData)
      return
    }
    const filteredData = [...listTokenData].filter((token) => token.tokenSymbol?.includes(filterData.symbol))
    setListTokenData(filteredData)
  }, [defaultListTokenData, filterData.symbol, listTokenData])

  return (
    <>
      {isShowTool ? (
        <div className="w-full flex mt-8 gap-4">
          <div className="w-3/4">
            <ScoopFilter filterData={filterData} setFilterData={setFilterData} />
            <ScoopTable
              data={listTokenData}
              isLoading={isLoadingTokenData}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
            />
          </div>
          <div className="w-1/4">
            <ScoopTool selectedToken={selectedToken} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Scoop
