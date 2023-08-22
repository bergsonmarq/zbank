import { ServerRoute } from "hapi";
import { CustomerController } from "../controllers/CustomerController";


const routes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/customers',
        handler: CustomerController.getAll
    },
    {
        method: 'GET',
        path: '/customers/{id}',
        handler: CustomerController.getOne
    },
    {
        method: 'POST',
        path: '/customers',
        handler: CustomerController.create
    },
    {
        method: 'DELETE',
        path: '/customers/{id}',
        handler: CustomerController.delete
    },
    {
        method: 'PUT',
        path: '/customers/{id}',
        handler: CustomerController.update
    },
    {
        method: 'GET',
        path: '/customers/{id}/info',
        handler: CustomerController.info
    }
];

export default routes;