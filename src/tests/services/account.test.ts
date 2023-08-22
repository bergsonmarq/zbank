import { expect } from "@hapi/code";
import mongoose from "mongoose";
import { afterEach, beforeEach, describe, it } from "mocha";
import AccountModel, { IAccount } from "../../models/account";
import CustomerModel, { ICustomer } from "../../models/customer";
import { AccountService } from "../../services/account";

describe("AccountService", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
   });
 
 afterEach(async () => {  
   await mongoose.connection.db.dropDatabase();  
 }); 

 const payload = {
  name: "Manoel",
  email: "manoel@caneta.com",
};

    describe("createCustomerAccount", () => {
      it("should create a new customer and account", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});

        if (typeof serviceRes === 'object' && serviceRes !== null){
          const customer = serviceRes.customer as ICustomer;
          const account = serviceRes.account as IAccount;
          expect(customer).to.exist();
          expect(customer.name).to.equal(payload.name);
          expect(customer.email).to.equal(payload.email);

          expect(account).to.exist();
          expect(account.balance).to.equal(0);
        }
      });

      it("should be false if customer not exists", async () => {
        const res = await AccountService.customerExists({ email: ""});
        expect(res).to.be.false();
      });

      it("should be true if customer exists", async () => {
        await AccountService.createCustomerAccount({payload});
        const res = await AccountService.customerExists({ email: payload.email});
        expect(res).to.be.true();
      });

      it("should return account by account number", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});
        if (typeof serviceRes === 'object' && serviceRes !== null){
          const account = serviceRes.account as IAccount;
          const res = await AccountService.findByAccountNumber({ accountNumber: account.accountNumber});
          expect(res).to.exist();
          expect(res?.accountNumber).to.equal(account.accountNumber);
        }
      });

      it("should return account by id", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});
        if (typeof serviceRes === 'object' && serviceRes !== null){
          const account = serviceRes.account as IAccount;
          const res = await AccountService.findById({ id: account._id});
          expect(res).to.exist();
          expect(res?._id).to.equal(account._id);
        }
      });

      it("should delete Customer and Account", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});
        if (typeof serviceRes === 'object' && serviceRes !== null){
          const customerRes = serviceRes.customer as ICustomer;
          const accountRes = serviceRes.account as IAccount;
          await AccountService.deleteCustomerAccount({ id: customerRes._id});
          
          const account: IAccount | null = await AccountModel.findOne(accountRes._id);
          const customer: ICustomer | null = await CustomerModel.findById(customerRes._id);
          
          expect(account).to.be.null();
          expect(customer).to.be.null();
        }
      });

      it("should return customer account info", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});
        if (typeof serviceRes === 'object' && serviceRes !== null){
          const customerRes = serviceRes.customer as ICustomer;        
          const res = await AccountService.getCustomerAccountInfo({ id: customerRes._id});
          expect(res).to.exist();
          expect(res?.customer).to.exist();
          expect(res?.account).to.exist();
        }
      });


      it("should return customer extract", async () => {
        const serviceRes = await AccountService.createCustomerAccount({payload});
        if (typeof serviceRes === 'object' && serviceRes !== null){        
          const accountRes = serviceRes.account as IAccount;
          const res = await AccountService.getExtract({ id: accountRes._id});
          expect(res).to.exist();
          expect(res?.account).to.exist();
          expect(res?.transactions).to.exist();
          expect(res?.transactions.length).to.equal(0);
        }
      });

    }); 
  });