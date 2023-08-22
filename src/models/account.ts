import mongoose, { Document, Schema, Types } from "mongoose";
import { ICustomer } from "./customer";

export interface IAccount extends Document {
  accountNumber: number;  
  balance: number;
  customer: Types.ObjectId | ICustomer;
}

const accountSchema: Schema = new Schema({
  accountNumber: { type: Number, unique: true },
  balance: { type: Number, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
});

accountSchema.pre<IAccount>('save', async function (next) {
  try {
    let account = this;
    if (!account.accountNumber) {
      account.accountNumber = Math.floor(100000 + Math.random() * 900000);
    }
    next();
  } catch (err: any) {
    console.log(err);
    throw err;
  }
});


export default mongoose.model<IAccount>('Account', accountSchema);