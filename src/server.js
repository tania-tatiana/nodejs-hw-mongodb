import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

import { getEnvVariable } from './utils/getEnvVariable.js';
import router from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';
const PORT = getEnvVariable('PORT') || 8080;

const app = express();

app.use(cors());
app.use(pinoHttp());

app.use(express.json());

app.use(cookieParser());

app.use('/avatars', express.static(path.resolve('src/uploads/avatars')));

app.use('/auth', authRoutes);

app.use('/contacts', authenticate, router);

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
