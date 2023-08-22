import { expect } from "@hapi/code";
import mongoose from "mongoose";
import Customer from "../../models/customer";
import Account from "../../models/account";
import Transaction from "../../models/transaction";

describe("Transaction Model", () => {
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

          await account.save();
    });

    it("should create a new transaction", async () => {
        const transaction = {
            source: account._id,
            destination: account._id,
            amount: 100,
            description: "Test transaction",
            type: "deposit"
        };

        const savedTransaction = await Transaction.create(transaction);
        expect(savedTransaction._id).to.exist();
        expect(savedTransaction.source).to.equal(transaction.source);
        expect(savedTransaction.amount).to.equal(transaction.amount);
        expect(savedTransaction.description).to.equal(transaction.description);        
    });
});