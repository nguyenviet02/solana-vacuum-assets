import { SwapResponse } from '@jup-ag/api'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, VersionedTransaction } from '@solana/web3.js'

async function executeSwapTransaction(swapData: SwapResponse, wallet: WalletContextState) {
  const connection = new Connection(import.meta.env.VITE_ENDPOINT_MAINNET)
  try {
    // 3. Deserialize the transaction
    const transactionBuffer = Buffer.from(swapData.swapTransaction, 'base64')
    const transaction = VersionedTransaction.deserialize(transactionBuffer)

    // 4. Sign the transaction
    if (!wallet.signTransaction) {
      throw new Error('Wallet does not support transaction signing')
    }
    const signedTransaction = await wallet.signTransaction(transaction)

    // 5. Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    })

    // 6. Confirm transaction with last valid block height
    const confirmation = await connection.confirmTransaction({
      signature,
      lastValidBlockHeight: swapData.lastValidBlockHeight,
      blockhash: signedTransaction.message.recentBlockhash,
    })

    // 7. Check transaction status
    if (confirmation.value.err) {
      throw new Error('Transaction failed')
    }

    return {
      signature,
      confirmation,
    }
  } catch (error) {
    console.error('Swap transaction error:', error)
    throw error
  }
}

export default executeSwapTransaction
