import mongoose, { Document, Schema, Types } from "mongoose";
import { IAccount } from "./account";

enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer',
}

export interface ITransaction extends Document {
    source: Types.ObjectId | IAccount;
    destination: Types.ObjectId | IAccount;
    amount: number;    
    description: string;
    type: TransactionType;        
}

const transactionSchema: Schema = new Schema({
    source: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Account', required: false },    
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    description: { type: String, required: true }
    },
    { timestamps: true 
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);