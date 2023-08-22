import Hapi from 'hapi';
import connectDB from './models/db';
import customerRoutes from './routes/customers';
import accountRoutes from './routes/account';
import transactionRoutes from './routes/transaction';

const server = new Hapi.Server({
  port: 3333,
  host: '0.0.0.0',
  routes: {
    cors: true
  }
});

server.route({
  method: 'GET',
  path: '/health_check',  
  handler: (request, h) => {
    return 'ok';
  }
});


const init = async () => {  
  server.route(customerRoutes);
  server.route(accountRoutes);  
  server.route(transactionRoutes);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

connectDB().then(() => {
  init();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

export default server;
