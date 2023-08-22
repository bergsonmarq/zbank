import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
    name: string;
    email: string;
}

const customerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

export default mongoose.model<ICustomer>('Customer', customerSchema);