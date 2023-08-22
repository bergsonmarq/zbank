import Hapi from 'hapi';
import { expect } from '@hapi/code';
import mongoose from "mongoose";
import customerRoutes from '../../routes/customers';

describe('Controller: Customer', () => {

    interface Customer {
        _id: string;
        name: string;
        email: string;
        __v: number;
      }
      
      interface Account {
        _id: string;
        balance: number;
        customer: string;
        accountNumber: number;
        __v: number;
      }

    const server = new Hapi.Server({
        port: 3333,
        host: '0.0.0.0',
        routes: {
            cors: true
        }
    });

    server.route(customerRoutes)

    beforeEach(async () => {
        await mongoose.connect("mongodb://localhost:27017/testdb");
       });
     
     afterEach(async () => {  
       await mongoose.connection.db.dropDatabase();  
     });

    const payload = {
        "name": "Manoel",
        "email": "manoel@caneta.com"
    }

        const createCustomer = async () => {
            return await server.inject({
                method: 'post',
                url: '/customers',
                payload: payload
            });
        }


    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/customers'
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).instanceOf(Array);

    });

    it('responds with 200 when create', async () => {
        const res = await createCustomer();
        expect(res.statusCode).to.equal(200);
        expect(res.result).instanceOf(Object);
    });  

    it('responds with 200 when updating a customer', async () => {
        const createRes = await createCustomer();        
        const customerData = createRes.result as { customer: Customer, account: Account };
        
        const updateRes = await server.inject({
            method: 'put',
            url: `/customers/${customerData.customer._id}`,
            payload: {
                "name": "Manoel Gomes",
                "email": "bluepen@caneta.com"
            }
        });
        expect(updateRes.statusCode).to.equal(200);
        expect(updateRes.result).instanceOf(Object);
    });

    it('responds with 200 when deleting a customer', async () => {
        const createRes = await createCustomer();        
        const customerData = createRes.result as { customer: Customer, account: Account };
        
        const deleteRes = await server.inject({
            method: 'delete',
            url: `/customers/${customerData.customer._id}`
        });
        expect(deleteRes.statusCode).to.equal(200);
        expect(deleteRes.result).instanceOf(Object);
    });

    it('responds with 200 when getting a customer', async () => {
        const createRes = await createCustomer();        
        const customerData = createRes.result as { customer: Customer, account: Account };
        
        const getRes = await server.inject({
            method: 'get',
            url: `/customers/${customerData.customer._id}`
        });
        expect(getRes.statusCode).to.equal(200);
        expect(getRes.result).instanceOf(Object);
        expect(payload.name).to.equal(customerData.customer.name);
        expect(customerData.account.balance).to.equal(0);
    });
});