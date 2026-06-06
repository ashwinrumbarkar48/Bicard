const nodemailer = require('nodemailer');

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.SMTP_HOST) {
    // No SMTP configured — log emails to the console instead of sending.
    cachedTransporter = {
      sendMail: async (opts) => {
        console.log('\n[email.service] SMTP not configured — email not sent.');
        console.log(`  To: ${opts.to}`);
        console.log(`  Subject: ${opts.subject}`);
        console.log(`  Body: ${opts.text || opts.html}\n`);
        return { messageId: 'dev-noop' };
      },
    };
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return cachedTransporter;
};

/**
 * Send an email.
 * @param {{ to: string, subject: string, text?: string, html?: string }} options
 */
const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@bicard.org';
  return transporter.sendMail({ from: `BICARD <${from}>`, to, subject, text, html, replyTo });
};

module.exports = sendEmail;
