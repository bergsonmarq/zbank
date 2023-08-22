import TransactionService from "../services/transaction";

export class TransactionController{
    public static async create({ payload }: { payload: any; }) {
        try{
            let valid = await TransactionService.validateTransaction({ payload });
            if (valid.status) {                            
                let newTransaction = await TransactionService.executeTransaction({ payload });
                return newTransaction;
            }else{
                return valid.message;
            }
        }
        catch(err: any){
            console.log(err);
            throw err;
        }        
    }

}