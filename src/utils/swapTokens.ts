import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js'

const swapTokens = async (wallet: WalletContextState, instructions: TransactionInstruction[]) => {
	if (!wallet?.signTransaction) {
		return;
	}

  const connection = new Connection(import.meta.env.VITE_ENDPOINT_MAINNET)
  const blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash)

  const messageV0 = new TransactionMessage({
    payerKey: wallet.publicKey!,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message()

  const transaction = new VersionedTransaction(messageV0)

  const signedTx = await wallet.signTransaction(transaction)
  const hash = await connection.sendRawTransaction(
		signedTx.serialize()
	);

	console.log(hash);
}

export default swapTokens
