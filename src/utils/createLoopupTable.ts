import { Connection, PublicKey, AddressLookupTableProgram } from "@solana/web3.js"

export const createAddressLookupTable = async (
  connection: Connection, 
  payer: PublicKey, 
  addresses: PublicKey[]
) => {
  const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    authority: payer,
    payer: payer,
    recentSlot: await connection.getSlot()
  })

  const extendInst = AddressLookupTableProgram.extendLookupTable({
    payer: payer,
    authority: payer,
    lookupTable: lookupTableAddress,
    addresses: addresses
  })

  return { lookupTableAddress, instructions: [lookupTableInst, extendInst] }
}