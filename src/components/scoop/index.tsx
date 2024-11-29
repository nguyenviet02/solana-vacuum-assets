import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import ScoopTable from './scoop-table'
import ScoopTool from './scoop-tool'
import { useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const Scoop = () => {
  const connection = useConnection()
  const wallet = useWallet()
  const publicKey = wallet?.publicKey
  console.log('☠️ ~ Scoop ~ publicKey:', publicKey?.toString())
  const walletToQuery = 'oiumuika2ktaLVaVdF5zMSpuy9LYQDrCbNX9Mukaaem'

  async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
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
    console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`)
    accounts.forEach((account, i) => {
      //Parse the account data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedAccountInfo: any = account.account.data
      const mintAddress: string = parsedAccountInfo['parsed']['info']['mint']
      const tokenBalance: number = parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
      //Log results
      console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`)
      console.log(`--Token Mint: ${mintAddress}`)
      console.log(`--Token Balance: ${tokenBalance}`)
    })
  }

  useEffect(() => {
    getTokenAccounts(walletToQuery, connection?.connection)
  }, [connection])
  return (
    <div className="w-full flex mt-8 gap-2">
      <ScoopTable />
      <div className="flex-1">
        <ScoopTool />
      </div>
    </div>
  )
}

export default Scoop
