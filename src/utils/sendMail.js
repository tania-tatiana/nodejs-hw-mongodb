import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';
import createHttpError from 'http-errors';

import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: getEnvVariable('SMTP_HOST'),
  port: Number(getEnvVariable('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVariable('SMTP_USER'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  mail.from = getEnvVariable('SMTP_FROM');
  try {
    return await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);

    throw new createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
}
