import Hapi from 'hapi';
import { expect } from '@hapi/code';
import mongoose from "mongoose";
import transactionRoutes from "../../routes/transaction";
import customerRoutes from '../../routes/customers';
import accountRoutes from '../../routes/account';
import fs from 'fs';
import { IAccount } from '../../models/account';
import { ICustomer } from '../../models/customer';


describe('Transaction Controller', () => {    
    let customerData: any;
    let customerData2: any;

    const server = new Hapi.Server({
        port: 3333,
        host: '0.0.0.0',
        routes: {
            cors: true
        }
    });

    server.route(transactionRoutes);
    server.route(customerRoutes);
    server.route(accountRoutes);


    const payloadAccount = {
        "name": "Manoel",
        "email": "manoel@caneta.com"
    }
        const payloadAccount2 = {
            "name": "Jeff",
            "email": "jeff@caneta.com"
        }

        const createCustomer = async (payload: any) => {
            return await server.inject({
                method: 'post',
                url: '/customers',
                payload: payload
            });
        }        

    beforeEach(async () => {
        await mongoose.connect("mongodb://localhost:27017/testdb");
    });

    before(async () => {
        const createRes = await createCustomer(payloadAccount);
        const createRes2 = await createCustomer(payloadAccount2);
        customerData = createRes.result as { customer: ICustomer, account: IAccount };
        customerData2 = createRes2.result as { customer: ICustomer, account: IAccount };
    });
     
     after(async () => {  
       await mongoose.connection.db.dropDatabase();  
     });
        
        const getAccount = async (id: string) => {
            return await server.inject({
                method: 'get',
                url: `/accounts/${id}`
            });
        }        

        it('should create a deposit transaction', async () => {

            const deposit = {
                "account_number_source": customerData.account.accountNumber,
                "account_number_destination": customerData.account.accountNumber,
                "amount": 10,
                "description": "Test transaction",
                "type": "deposit"
            };

            const res = await server.inject({
                method: 'post',
                url: '/transactions',
                payload: deposit
            });

            const accountRes = await getAccount(customerData.account._id);
            let accountFromRes = accountRes.result as IAccount;

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.exist();
            expect(accountFromRes.balance).to.equal(10);

        });

        it('should create a withdraw transaction', async () => { 

            const withdrawPayload = {
                "account_number_source": customerData.account.accountNumber,
                "account_number_destination": customerData.account.accountNumber,
                "amount": 1,
                "description": "Test transaction",
                "type": "withdraw"
            };

            const resWithdraw = await server.inject({
                method: 'post',
                url: '/transactions',
                payload: withdrawPayload
            });        
            
            expect(resWithdraw.statusCode).to.equal(200);
            expect(resWithdraw.result).to.exist();

            const accountRes = await getAccount(customerData.account._id);
            const account = accountRes.result as IAccount;
            expect(account.balance).to.equal(9);
        }
    );

    it ('should create a transfer transaction', async () => {
        const transferPayload = {
            "account_number_source": customerData.account.accountNumber,
            "account_number_destination": customerData2.account.accountNumber,
            "amount": 1,
            "description": "Test transaction",
            "type": "transfer"
        };

        const resTransfer = await server.inject({
            method: 'post',
            url: '/transactions',
            payload: transferPayload
        });

        expect(resTransfer.statusCode).to.equal(200);
        expect(resTransfer.result).to.exist();

        const accountRes = await getAccount(customerData.account._id);
        const account = accountRes.result as IAccount;
        expect(account.balance).to.equal(8);

        const accountRes2 = await getAccount(customerData2.account._id);
        const account2 = accountRes2.result as IAccount;
        expect(account2.balance).to.equal(1);
    });

    it ('should not create a withdraw transaction with insufficient funds', async () => {
        const withdrawPayload = {
            "account_number_source": customerData.account.accountNumber,
            "account_number_destination": customerData.account.accountNumber,
            "amount": 100,
            "description": "Test transaction",
            "type": "withdraw"
        };

        const resWithdraw = await server.inject({
            method: 'post',
            url: '/transactions',
            payload: withdrawPayload
        });
        
        expect(resWithdraw.result).to.exist();
        
        const resWithdrawString = JSON.stringify(resWithdraw.result);
        expect(resWithdrawString).to.equal('"Insufficient funds"');
    }
);
});