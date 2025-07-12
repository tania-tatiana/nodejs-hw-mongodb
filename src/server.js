import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

import { getEnvVariable } from './utils/getEnvVariable.js';
import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
const PORT = getEnvVariable('PORT') || 8080;

const app = express();

app.use(cors());
app.use(pinoHttp());

app.use(express.json());

app.use('/contacts', router);

app.use(notFoundHandler);

app.use(errorHandler);

export function setupServer() {
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}
