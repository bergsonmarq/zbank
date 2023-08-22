import { expect } from '@hapi/code';
import Customer, { ICustomer } from "../../models/customer";
import mongoose from "mongoose";
import Account from "../../models/account";

describe('Model: Account', () => {
    let account: any;

beforeEach(async () => {
    
    await mongoose.connect("mongodb://localhost:27017/testdb");

    const savedCustomer = await Customer.create(
        {
            name: "Pepito Perez",
            email: 'pepito@perez.com'
        }
    );

    account = new Account(
        {
            accountNumber: 123456789,
            balance: 1000,
            customer: savedCustomer._id
        });
});

    it('should save account', async () => {
        const savedAccount = await Account.create(account);
        expect(savedAccount.accountNumber).to.equal(123456789);
        expect(savedAccount.balance).to.equal(1000);
        
    });

});