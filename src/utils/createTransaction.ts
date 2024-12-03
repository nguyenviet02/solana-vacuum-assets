import { QuoteGetRequest, QuoteResponse, createJupiterApiClient, ResponseError } from '@jup-ag/api'
import { WalletContextState } from '@solana/wallet-adapter-react'
import executeSwapTransaction from './executeSwapTransaction'

const ENDPOINT = `https://public.jupiterapi.com`
const CONFIG = {
  basePath: ENDPOINT,
}

async function createTransaction(quoteRequest: QuoteGetRequest, wallet: WalletContextState): Promise<void> {
  const jupiterApi = createJupiterApiClient(CONFIG)
  try {
    // 1. Retrieve a Swap Quote
    const quote: QuoteResponse | null = await jupiterApi.quoteGet(quoteRequest)
    if (!quote) {
      throw new Error('No quote found')
    }

    // 2. Get Serialized Swap Transaction
    const swapResult = await jupiterApi.swapPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet?.publicKey?.toBase58() || '',
      },
    })
    if (!swapResult) {
      throw new Error('No swap result found')
    }
    executeSwapTransaction(swapResult, wallet)
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(await error.response.json())
    } else {
      console.error(error)
    }
  }
}

export default createTransaction
