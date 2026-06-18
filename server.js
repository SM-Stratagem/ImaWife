const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// SMTP Configuration
const smtpHost = process.env.ZOHO_SMTP_HOST;
const smtpPort = Number.parseInt(process.env.ZOHO_SMTP_PORT, 10);
const smtpUser = process.env.ZOHO_SMTP_USER;
const smtpPassword = process.env.ZOHO_SMTP_PASSWORD;
const smtpFrom = process.env.ZOHO_SMTP_FROM || smtpUser;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
  console.warn('SMTP environment variables are incomplete. Email sending will fail until they are set.');
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort !== 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { recipientEmail, senderName, subject, body } = req.body;

    // Validate required fields
    if (!recipientEmail || !body) {
      return res.status(400).json({ error: 'Recipient email and body are required' });
    }

    // Render any links in the body to be clickable
    const renderedBody = renderLinksInBody(body);

    const mailOptions = {
      from: `"You Messed Up 💔" <${smtpFrom}>`,
      to: recipientEmail,
      subject: subject || 'You Messed Up',
      text: renderedBody,
      html: convertToHtml(renderedBody, senderName),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Function to render links in body text
function renderLinksInBody(text) {
  // Regex to find URLs in text
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Replace URLs with formatted versions
  return text.replace(urlRegex, (url) => {
    return `${url} (Clickable link: ${url})`;
  });
}

// Function to convert plain text to HTML with basic formatting
function convertToHtml(text, senderName) {
  // Convert line breaks to <br> tags
  let html = text.replace(/\n/g, '<br>');
  
  // Make URLs clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  html = html.replace(urlRegex, (url) => {
    return `<a href="${url}" style="color: #C96B5E; text-decoration: underline;">${url}</a>`;
  });
  
  // Add signature styling
  if (senderName) {
    const signatureRegex = /— (.+)$/;
    html = html.replace(signatureRegex, (match, name) => {
      return `<br><br><div style="font-style: italic; color: #6B4750; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E2978C;">— ${name}</div>`;
    });
  }
  
  return `
    <div style="font-family: 'Work Sans', sans-serif; color: #3D2630; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      ${html}
    </div>
  `;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
