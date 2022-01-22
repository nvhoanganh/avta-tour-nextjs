// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API)
const msg = {
  to: 'nvhoanganh1909@gmail.com', // Change to your recipient
  from: 'nvhoanganh1909@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then((x) => {
    console.log('Email sent', x)
  })
  .catch((error) => {
    console.error(error)
  })