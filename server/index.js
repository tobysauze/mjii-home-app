/* Simple email service for MJII Home App
 * - Run: npm start
 * - Configure: copy .env.example to .env and fill SMTP settings
 */
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8787;

// Create transport using SMTP credentials
function createTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[Email] Missing SMTP env vars. Please configure .env');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE || 'false') === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

const transporter = createTransport();

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/verify', async (_req, res) => {
  try {
    await transporter.verify();
    res.json({ ok: true });
  } catch (err) {
    console.error('SMTP verify failed:', err && err.message ? err.message : err);
    res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
});

app.post('/send', async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body || {};
    const fromEmail = from || process.env.FROM_EMAIL || process.env.SMTP_USER;

    let recipients = Array.isArray(to) ? to : undefined;
    if (!recipients || recipients.length === 0) {
      const envTo = process.env.EMAIL_RECIPIENTS || '';
      recipients = envTo
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Missing recipients (body.to[] or EMAIL_RECIPIENTS env)' });
    }
    if (!subject || !text) {
      return res.status(400).json({ error: 'Missing subject/text' });
    }

    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipients.join(','),
      subject,
      text,
      html: html || undefined,
    });

    res.json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ ok: false, error: 'send_failed' });
  }
});

app.listen(port, () => {
  console.log(`[Email] Server listening on http://localhost:${port}`);
});


