import { ServerRoute } from "hapi";
import { TransactionController } from "../controllers/TransactionController";

const routes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/transactions',
        handler: TransactionController.create
    }
];

export default routes;