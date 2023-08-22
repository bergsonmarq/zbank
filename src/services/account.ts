import { ICustomer } from "../models/customer";
import AccountModel, { IAccount } from "../models/account";
import CustomerModel from "../models/customer";
import TransactionModel from "../models/transaction";

export class AccountService{    
    public static async createCustomerAccount({ payload }: { payload: any; }) {
        try{            
            let exists = await AccountService.customerExists({ email: payload.email });
            if (exists) {
                return "Customer already exists"
            }

            let newCustomer: ICustomer | null = await CustomerModel.create(payload);

            if (!newCustomer) {
                throw new Error("Customer not found");
            }else{
                await AccountModel.create({customer: newCustomer._id, balance: 0});
            }   
            
            return this.getCustomerAccountInfo({ id: newCustomer._id });
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }

    public static async customerExists({ email }: { email: any; }) {
        try{            
            let customer: ICustomer | null = await CustomerModel.findOne({ email });            
            return customer ? true : false;
        }
        catch(err: any){            
            throw err;
        }
    }

    public static async findByAccountNumber({ accountNumber }: { accountNumber: any; }) {
        try{
            let account: IAccount | null = await AccountModel.findOne({accountNumber});
            
            if (!account) {
                return null;
            }else{                
                return account;
            }   
        }
        catch(err: any){
            console.log(err);
            throw err;
        }        
        
    }

    public static async findById({ id }: { id: any; }) {
        try{
            let account: IAccount | null = await AccountModel.findById(id);

            if (!account) {
                throw new Error("Account not found");
            }else{
                return account;
            }
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }

    public static async deleteCustomerAccount({ id }: { id: any; }) {
        try{
            let customer: ICustomer | null = await CustomerModel.findById(id);
            if (!customer) {                
                return "Customer not found";
            }else{
                try{
                const account: IAccount | null = await AccountModel.findOne({customer: customer._id});
                if (!account) {
                    return "Account not found";
                }else{
                let transactions = await TransactionModel.find({ $or: [{ source: account._id }, { destination: account._id }] });
                    if (transactions.length > 0) {
                        return "Customer has transactions";
                    }else{
                        await AccountModel.findOneAndDelete({customer: customer._id});
                        await CustomerModel.findOneAndDelete({_id: customer._id});
                    }
                }
                }catch(err: any){

                }
            }   
            
            return customer;
        }
        catch(err: any){
            console.log(err);
            throw err;
        }        
        
    }

    public static async getCustomerAccountInfo({ id }: { id: any; }) {
        try{
            let customer: ICustomer | null = await CustomerModel.findById(id);
            if (!customer) {
                throw new Error("Customer not found");
            }else{
                let account = await AccountModel.findOne({customer: customer._id});
                if(!account){
                    throw new Error("Account not found");
                }else{
                    return {customer, account};
                }
            }   
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }

    public static async getExtract({ id }: { id: any; }) {
        const account = await AccountService.findById({ id });
        try{
            let transactions = await TransactionModel.find({ $or: [{ source: account._id }, { destination: account._id }] });
            return {account, transactions};
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }
}