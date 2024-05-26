const nodemailer = require('nodemailer');

mailConfig = {
    // host: 'pinnacle.herosite.pro', // SMTP Host
    host: 'mail.healthconnectpro.in', // SMTP Host
    port: 465,   // SMTP Port
    secure: true,           // true for 465, false for other ports
    auth: {
        user: 'clinic@healthconnectpro.in', // your SMTP username
        pass: '6n*_fhVG;7G%'  // your SMTP password
    }
}

// Create a SMTP transporter object
let transporter = nodemailer.createTransport(mailConfig);




async function sendMail(mailOptions) {
    console.log(mailOptions)
    try {
        resp = await transporter.sendMail(mailOptions)
        return resp
    } catch (error) {
        console.error(`sendMail::Failed to share invoice details: ${error.message}`);
        throw error
    }
}

// Export Modules
module.exports = {
    sendMail
  };