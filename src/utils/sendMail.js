import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';
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

export function sendMail(mail) {
  mail.from = 'bangchanka0310@gmail.com';
  return transporter.sendMail(mail);
}
