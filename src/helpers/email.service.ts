'use strict';

import nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, url: string) => {
  // Generate test SMTP service account from ethereal.email

  // create reusable transporter object using the default SMTP transport
  const client = nodemailer.createTransport({
    service: 'Mailgun',
    port: 587,
    auth: {
      user: 'postmaster@sandbox5a5ea81d6af94fd98abeac4ae86f3f85.mailgun.org',
      pass: '7afb549ad28ca9f030a44addb50c9be8-87c34c41-c6887430',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  const info = await client.sendMail({
    from: '"Wave App 👻" <wavemetrosoftware@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Reset Password ✔', // Subject line
    text: `Hello! You request a password's reset, Here is your link: ${url} `, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
