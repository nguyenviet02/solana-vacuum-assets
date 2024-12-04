import { Instruction } from '@jup-ag/api'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  sendAndConfirmRawTransaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import deserializeInstruction from './deserializeInstruction'

const swapTokens = async (
  wallet: WalletContextState,
  dataTransactions: {
    instruction: TransactionInstruction
    computeBudgetInstructions: Instruction[]
    addressLookupTableAddresses: PublicKey[]
  }[],
	onSuccess: () => void,
) => {
  if (!wallet?.signTransaction) {
    return
  }

  const connection = new Connection(import.meta.env.VITE_ENDPOINT_MAINNET)
  const blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash)
  const listTransactions = []

  for (const dataTransaction of dataTransactions) {
    const addressLookupTableAccounts = await Promise.all(
      dataTransaction?.addressLookupTableAddresses.map(async (address) => {
        const lookupTableAccount = (await connection.getAddressLookupTable(address)).value
        return lookupTableAccount
      }),
    )

    const dataInstruction = []

    dataInstruction.push(dataTransaction.instruction)

    for (const computeBudgetInstruction of dataTransaction.computeBudgetInstructions) {
      dataInstruction.push(deserializeInstruction(computeBudgetInstruction))
    }

    console.log('☠️ ~ dataInstruction:', dataInstruction)
    const messageV0 = new TransactionMessage({
      payerKey: wallet.publicKey!,
      recentBlockhash: blockhash,
      instructions: dataInstruction,
    }).compileToV0Message(addressLookupTableAccounts as AddressLookupTableAccount[])
    const transaction = new VersionedTransaction(messageV0)

    listTransactions.push(transaction)
  }

  if (wallet?.signAllTransactions) {
    const signedTransactions = await wallet.signAllTransactions(listTransactions.map((transaction) => transaction))

    await Promise.all(
      signedTransactions.map(async (transaction) => {
        try {
          const result = await sendAndConfirmRawTransaction(connection, Buffer.from(transaction.serialize()), {})
          console.log('☠️ ~ signedTransactions.map ~ result:', result)
          console.log('Transaction Success!')
					onSuccess()
        } catch (err) {
          console.log('Transaction failed!')
          console.log(err)
        }
      }),
    )
  }
}

export default swapTokens
