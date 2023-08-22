import { expect } from '@hapi/code';
import Customer from "../../models/customer";
import mongoose from "mongoose";

describe('Model: Customer', () => {

let model: any;
let customer2: any;

beforeEach(async () => {
   await mongoose.connect("mongodb://localhost:27017/testdb");
  });

afterEach(async () => {  
  await mongoose.connection.db.dropDatabase();  
});

beforeEach(() => {

    model = new Customer(
        {
            name: "Pepito Perez",
            email: 'perez@pepito.com'
        }
    );    

    customer2 = new Customer(
        {
            name: "Maria Perez",
            email: 'maria@perez.com'
        });

    }
);

    it('should save customer', async () => {
        const savedCustomer = await Customer.create(model);

        expect(savedCustomer.name).to.not.be.empty();
        expect(savedCustomer.name).to.equal('Pepito Perez');
    
        expect(savedCustomer.email).to.not.be.empty();
        expect(savedCustomer.email).to.equal('perez@pepito.com');
    });

    it('should not save customer with same email', async () => {        
        await Customer.create(model);
        try {
            await Customer.create(model);
          } catch (error) {
            
            expect(error).to.be.an.error(Error);
          }
    });

    it('should save customer with different email', async () => {
        await Customer.create(model);
        const savedCustomer = await Customer.create(customer2);

        expect(savedCustomer.name).to.not.be.empty();
        expect(savedCustomer.name).to.equal('Maria Perez');
    
        expect(savedCustomer.email).to.not.be.empty();
        expect(savedCustomer.email).to.equal('maria@perez.com');
    });


});