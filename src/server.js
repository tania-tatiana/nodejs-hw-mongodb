import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

import { getEnvVariable } from './utils/getEnvVariable.js';
import { getAllContacts, getContact } from './services/contacts.js';

const PORT = getEnvVariable('PORT') || 8080;

const app = express();

app.use(cors());
app.use(pinoHttp());

app.get('/contacts', getAllContacts);
app.get('/contacts/:contactId', getContact);
app.use((req, res, next) => {
  res.status(404).json({ status: 404, message: 'Not found' });
});

export function setupServer() {
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}
