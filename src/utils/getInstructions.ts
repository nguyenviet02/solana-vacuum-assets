import { QuoteGetRequest, QuoteResponse, createJupiterApiClient, ResponseError } from '@jup-ag/api'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'

const ENDPOINT = `https://public.jupiterapi.com`
const CONFIG = {
  basePath: ENDPOINT,
}

async function getInstructions(quoteRequest: QuoteGetRequest, wallet: WalletContextState) {
  const jupiterApi = createJupiterApiClient(CONFIG)
  try {
    // 1. Retrieve a Swap Quote
    const quote: QuoteResponse | null = await jupiterApi.quoteGet(quoteRequest)
    if (!quote) {
      throw new Error('No quote found')
    }

    // 2. Get Serialized Swap Transaction
    const swapResult = await jupiterApi.swapInstructionsPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet?.publicKey?.toBase58() || '',
      },
    })
    if (!swapResult) {
      throw new Error('No swap result found')
    }
    console.log('☠️ ~ getInstructions ~ swapResult:', swapResult)
    return new TransactionInstruction({
      keys: swapResult.swapInstruction.accounts.map((account) => ({
        ...account,
        pubkey: new PublicKey(account.pubkey),
      })),
      programId: new PublicKey(swapResult?.swapInstruction?.programId),
      data: Buffer.from(swapResult?.swapInstruction?.data, 'base64'),
    })
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(await error.response.json())
    } else {
      console.error(error)
    }
  }
}

export default getInstructions
