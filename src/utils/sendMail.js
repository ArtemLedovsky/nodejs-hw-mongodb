import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export const sendMail = (payload) => {
  return transporter.sendMail(payload);
};
