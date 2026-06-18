const nodemailer = require('nodemailer');

function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function renderLinksInBody(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return String(text).replace(urlRegex, (url) => `${url} (Clickable link: ${url})`);
}

function convertToHtml(text, senderName) {
  let html = String(text).replace(/\n/g, '<br>');
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  html = html.replace(urlRegex, (url) => `<a href="${url}" style="color: #C96B5E; text-decoration: underline;">${url}</a>`);

  if (senderName) {
    const signatureRegex = /— (.+)$/;
    html = html.replace(
      signatureRegex,
      (match, name) => `<br><br><div style="font-style: italic; color: #6B4750; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E2978C;">— ${name}</div>`,
    );
  }

  return `
    <div style="font-family: 'Work Sans', sans-serif; color: #3D2630; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      ${html}
    </div>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientEmail, senderName, subject, body } = parseJsonBody(req.body);
  if (!recipientEmail || !body) {
    return res.status(400).json({ error: 'Recipient email and body are required' });
  }

  const smtpHost = process.env.ZOHO_SMTP_HOST;
  const smtpPort = Number.parseInt(process.env.ZOHO_SMTP_PORT, 10);
  const smtpUser = process.env.ZOHO_SMTP_USER;
  const smtpPassword = process.env.ZOHO_SMTP_PASSWORD;
  const smtpFrom = process.env.ZOHO_SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    return res.status(500).json({
      error: 'SMTP configuration is incomplete',
      details: 'Set ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, ZOHO_SMTP_USER, and ZOHO_SMTP_PASSWORD in Vercel env vars.',
    });
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

  try {
    const renderedBody = renderLinksInBody(body);
    const info = await transporter.sendMail({
      from: `"You Messed Up 💔" <${smtpFrom}>`,
      to: recipientEmail,
      subject: subject || 'You Messed Up',
      text: renderedBody,
      html: convertToHtml(renderedBody, senderName),
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
};
