import { ITransaction } from "../models/transaction";
import { AccountService } from "./account";
import TransactionModel from "../models/transaction";

export default class TransactionService{


    public static async findAccountByAccountNumber({ accountNumber }: { accountNumber: any; }) {
       return await AccountService.findByAccountNumber({ accountNumber: accountNumber }); 
    };

    public static async validateTransaction({ payload }: { payload: any; }) {
        try{        
        let source = await this.findAccountByAccountNumber({ accountNumber: payload.account_number_source });
        
        if (!source) {
            return {message: "Source account not found", status: false};
        }else{
            payload.source = source;
        }
        

        if (payload.type === 'transfer' && payload.account_number_destination) {
            let destination = await this.findAccountByAccountNumber({ accountNumber: payload.account_number_destination });
            if (!destination) {
                return {message: "Destination account not found", status: false};
            }else{
                payload.destination = destination;
            }
        }        
            return await this.validateByTransactionType({ payload });            
        }
        catch(err: any){
            console.log(err);
            throw err;
        }        
    }


    public static async validateByTransactionType({ payload }: { payload: any; }) {
        console.log(payload.amount, payload.source.balance);
        if ((payload.type === 'withdraw' || payload.type === 'transfer') && payload.amount > payload.source.balance) {            
            return {message: "Insufficient funds", status: false};        
        }else if (payload.type === 'transfer' && payload.account_number_source === payload.account_number_destination) {
            return {message: "Source and destination accounts must be different", status: false};
        }else{
            return {message: "Transaction validated", status: true};
        }
    }

    public static async executeTransaction({ payload }: { payload: any; }) {
        try{
            let transaction: ITransaction = await TransactionModel.create(payload);

            if (transaction.type === 'withdraw') {
                let account = await TransactionService.executeWithdrawal({ transaction });
                return {account, transaction}
            }else if (transaction.type === 'deposit') {
                let account =  await TransactionService.executeDeposit({ transaction });
                return {account, transaction}
            }else if (transaction.type === 'transfer') {
                return await TransactionService.executeTransfer({ transaction });
            }else{                
                return {message: "Invalid transaction type", status: false}
            }
        }
        catch(err: any){
            console.log(err);
            return err.message;
        }        
    }

    public static async executeDeposit({ transaction }: { transaction: ITransaction; }) {
        try{
            let account = await AccountService.findById({ id: transaction.source });
            account.balance += transaction.amount;
            await account.save();
            return account;
        }
        catch(err: any){
            console.log(err);
            throw err;
        }        
    }

    public static async executeWithdrawal({ transaction }: { transaction: ITransaction; }) {
        try{
            let account = await AccountService.findById({ id: transaction.source });
            account.balance -= transaction.amount;
            await account.save();
            return account;
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }

    public static async executeTransfer({ transaction }: { transaction: ITransaction; }) {
        try{
            let source = await AccountService.findById({ id: transaction.source });
            let destination = await AccountService.findById({ id: transaction.destination });
            source.balance -= transaction.amount;
            destination.balance += transaction.amount;
            await source.save();
            await destination.save();
            return {source, destination};
        }
        catch(err: any){
            console.log(err);
            throw err;
        }
    }
}