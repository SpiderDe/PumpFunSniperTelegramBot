import bs58 from 'bs58';

import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    ParsedInstruction,
    ParsedAccountData,
    VersionedTransaction,
    TransactionMessage,
    LAMPORTS_PER_SOL,
    BlockhashWithExpiryBlockHeight
} from "@solana/web3.js";

import { rpc } from '../config';

export const connection = new Connection(rpc);

export const createWallet = () => {
    let keypair = Keypair.generate();
    let publicKey = keypair.publicKey.toBase58();
    let privateKey = bs58.encode(keypair.secretKey);
    return { publicKey, privateKey };
}

export const getSolBalance = async (wallet: PublicKey) => {
    const balance = await connection.getBalance(wallet);
    return balance / LAMPORTS_PER_SOL;
}