const nodemailer = require('nodemailer');

const sendEmail = async (req, token) => {
  const text = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`;

  const html = `Forgot your password? Please use the link below to create a new password:
  <p>${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}
  </p>`;

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '85a60c356862ff', // generated ethereal user
      pass: '83290fefbe26cc' // generated ethereal password
    }
  });

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Allen 👻" <allen@example.com>', // sender address
      to: 'allenflynn.ca@gmail.com', // list of receivers
      subject: 'Reset password', // Subject line
      text: text, // plain text body
      html: html // html body
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
