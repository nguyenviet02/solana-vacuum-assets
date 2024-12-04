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
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const swapTokens = async (
  wallet: WalletContextState,
  dataTransactions: {
    instruction: TransactionInstruction
    computeBudgetInstructions: Instruction[]
    addressLookupTableAddresses: PublicKey[]
    tokenAddress: PublicKey
    accountAddress: PublicKey
  }[],
  onSuccess: () => void,
  onFail: () => void,
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

    const closeAccountIx = createCloseAccountInstruction(
      dataTransaction.accountAddress,
      wallet.publicKey!,
      wallet.publicKey!,
      [],
      TOKEN_PROGRAM_ID,
    )
    dataInstruction.push(closeAccountIx)

    for (const computeBudgetInstruction of dataTransaction.computeBudgetInstructions) {
      dataInstruction.push(deserializeInstruction(computeBudgetInstruction))
    }

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
          await sendAndConfirmRawTransaction(connection, Buffer.from(transaction.serialize()), {})
          console.log('Transaction Success!')
          onSuccess()
        } catch (err) {
          console.log('Transaction failed!')
          console.log(err)
          onFail()
        }
      }),
    )
  }
}

export default swapTokens
