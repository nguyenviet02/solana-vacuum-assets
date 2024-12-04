import { QuoteGetRequest, QuoteResponse, createJupiterApiClient, ResponseError } from '@jup-ag/api'
import { WalletContextState } from '@solana/wallet-adapter-react'
import deserializeInstruction from './deserializeInstruction'

const ENDPOINT = `https://public.jupiterapi.com`
const CONFIG = {
  basePath: ENDPOINT,
}

async function getInstructions(quoteRequest: QuoteGetRequest, wallet: WalletContextState) {
  const jupiterApi = createJupiterApiClient(CONFIG)
  try {
    const quote: QuoteResponse | null = await jupiterApi.quoteGet(quoteRequest)
    if (!quote) {
      throw new Error('No quote found')
    }

    const swapResult = await jupiterApi.swapInstructionsPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet?.publicKey?.toBase58() || '',
      },
    })
    if (!swapResult) {
      throw new Error('No swap result found')
    }
    return {
      addressLookupTableAddresses: swapResult.addressLookupTableAddresses,
      computeBudgetInstructions: swapResult.computeBudgetInstructions,
      instruction: deserializeInstruction(swapResult.swapInstruction),
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(await error.response.json())
    } else {
      console.error(error)
    }
  }
}

export default getInstructions
