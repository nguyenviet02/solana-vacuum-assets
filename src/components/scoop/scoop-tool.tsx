import { TTokenData } from '@/types'
import getInstructions from '@/utils/getInstructions'
import swapTokens from '@/utils/swapTokens'
import { QuoteGetRequest, QuoteResponse } from '@jup-ag/api'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'

type Props = {
  selectedToken: TTokenData[]
  refetchTokenAccounts: () => void
  listDataQuote: QuoteResponse[]
}

const ScoopTool = ({ selectedToken, refetchTokenAccounts, listDataQuote }: Props) => {
  const wallet = useWallet()
  const [isSwapping, setIsSwapping] = useState(false)
  console.log('☠️ ~ ScoopTool ~ isSwapping:', isSwapping)

  const possibleSwap = useMemo(() => {
    return listDataQuote.reduce((acc, quote) => {
      return acc + Number(quote.outAmount) / Math.pow(10, 6)
    }, 0)
  }, [listDataQuote])

  const totalSwap = useMemo(() => {
    return selectedToken.reduce((acc, token) => {
      const outAmount = listDataQuote.find((quote) => quote.inputMint === token.mintAddress)?.outAmount
      if (!outAmount) return acc
      return acc + Number(outAmount) / Math.pow(10, 6)
    }, 0)
  }, [selectedToken, listDataQuote])

  const onSwapSuccess = () => {
    refetchTokenAccounts()
    setIsSwapping(false)
  }

  const onSwapFail = () => {
    setIsSwapping(false)
  }

  const swapToken = async () => {
    const quoteRequests: QuoteGetRequest[] = [...selectedToken]?.map((token) => {
      return {
        inputMint: token.mintAddress,
        outputMint: import.meta.env.VITE_CAT_ADDRESS,
        amount: Math.round(token?.tokenBalance * Math.pow(10, token?.decimals)),
      }
    })

    const dataTransactions = []

    for (const quoteRequest of quoteRequests) {
      const data = await getInstructions(quoteRequest, wallet)
      const token = selectedToken.find((token) => token.mintAddress === quoteRequest.inputMint)
      const dataTransaction = {
        instruction: data!.instruction,
        computeBudgetInstructions: data!.computeBudgetInstructions,
        addressLookupTableAddresses: data!.addressLookupTableAddresses.map((address) => new PublicKey(address)),
        tokenAddress: new PublicKey(quoteRequest.inputMint),
        accountAddress: token!.accountAddress,
      }
      dataTransactions.push(dataTransaction)
    }

    await swapTokens(wallet, dataTransactions, onSwapSuccess, onSwapFail)

    setIsSwapping(false)
  }

  return (
    <div className="flex flex-col gap-3 w-full border border-black p-4 rounded">
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">{possibleSwap}</p>
          <p className="text-[12px]">Possible Scoop</p>
        </div>
        <button>DEL</button>
      </div>
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">{totalSwap}</p>
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
