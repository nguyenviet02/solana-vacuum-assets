import { TTokenData } from '@/types'
import createTransaction from '@/utils/createTransaction'
import { QuoteGetRequest } from '@jup-ag/api'
import { useWallet } from '@solana/wallet-adapter-react'

type Props = {
  selectedToken: TTokenData[]
}

const ScoopTool = ({ selectedToken }: Props) => {
  const wallet = useWallet()
  const swapToken = async () => {
    const quoteRequests: QuoteGetRequest[] = [...selectedToken]?.map((token) => {
      return {
        inputMint: token.mintAddress,
        outputMint: import.meta.env.VITE_CAT_ADDRESS,
        amount: token?.tokenBalance * Math.pow(10, token?.decimals),
      }
    })

    for (const quoteRequest of quoteRequests) {
      await createTransaction(quoteRequest, wallet)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full border border-black p-4 rounded">
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">0</p>
          <p className="text-[12px]">Possible Scoop</p>
        </div>
        <button>DEL</button>
      </div>
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">0</p>
          <p className="text-[12px]">Total Scoop</p>
        </div>
        <button>DEL</button>
      </div>
      <button onClick={swapToken} className="w-full flex justify-center items-center py-3 bg-base-300 rounded-md">
        Scoop
      </button>
    </div>
  )
}

export default ScoopTool
