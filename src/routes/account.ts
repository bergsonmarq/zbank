import { ServerRoute } from 'hapi';
import { AccountController } from '../controllers/AccountController';

const routes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/accounts',
        handler: AccountController.getAll
    },    
    {
        method: 'GET',
        path: '/accounts/{id}/extract',
        handler: AccountController.getExtract
    },
    {
        method: 'GET',
        path: '/accounts/{id}',
        handler: AccountController.getOne
    }
];

export default routes;