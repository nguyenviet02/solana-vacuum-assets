import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import ScoopTable from './scoop-table'
import ScoopTool from './scoop-tool'
import { useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import getTokenMetadataByMint from '@/utils/getTokenMetadata'
import { TTokenData } from '@/types'

const Scoop = () => {
  const connection = useConnection()
  const wallet = useWallet()
  const walletToQuery = useMemo(() => {
    return wallet?.publicKey?.toString() || ''
  }, [wallet])

  const [isLoadingTokenData, setIsLoadingTokenData] = useState(true)
  const [listTokenData, setListTokenData] = useState<TTokenData[]>([])
  const [isShowTool, setIsShowTool] = useState(false)

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
      if (tokenBalance === 0) return
      const tokenMetadata = await getTokenMetadataByMint(solanaConnection, mintAddress)
      const tokenData = {
        mintAddress,
        tokenBalance,
        tokenSymbol: tokenMetadata?.symbol,
      }
      listToken.push(tokenData)
    }
    setListTokenData(listToken)
    setIsLoadingTokenData(false)
  }

  useEffect(() => {
    getTokenAccounts(walletToQuery, connection?.connection)
  }, [connection, walletToQuery])

  useEffect(() => {
    if (walletToQuery === '') {
      setIsShowTool(false)
      return
    }
    setIsShowTool(true)
  }, [walletToQuery])

  return (
    <>
      {isShowTool ? (
        <div className="w-full flex mt-8 gap-4">
          <div className="w-3/4">
            <ScoopTable data={listTokenData} isLoading={isLoadingTokenData} />
          </div>
          <div className="w-1/4">
            <ScoopTool />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Scoop
