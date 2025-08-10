import * as fs from 'node:fs';
import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import { getEnvVariable } from './utils/getEnvVariable.js';
import router from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';
const PORT = getEnvVariable('PORT') || 8080;

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

const app = express();

app.use(cors());
app.use(pinoHttp());

app.use(express.json());

app.use(cookieParser());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

app.use('/photo', express.static(path.resolve('src/uploads/photo')));

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
