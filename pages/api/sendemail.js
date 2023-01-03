import { sendSms, initFirebase } from '../../lib/backendapi';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
const sgMail = require('@sendgrid/mail');

export default async function sendemail(req, res) {
  const { subject, html, to, from, text, templateId } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Access token missing' })
  }

  try {
    console.log(`Sending email to ${to} using key ${process.env.SENDGRID_API_KEY}`);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to,
      from,
      subject,
      text,
      html,
      templateId
    }

    const result = await sgMail.send(msg);

    res.status(200).json({ success: true, ...result });
    res.end()
  } catch (error) {
    console.error("🚀 ~ file: sendemail.js:31 ~ sendemail ~ error", error)
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
