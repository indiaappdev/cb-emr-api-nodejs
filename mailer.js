const nodemailer = require('nodemailer');

mailConfig = {
    // host: 'pinnacle.herosite.pro', // SMTP Host
    host: 'mail.healthconnectpro.in', // SMTP Host
    port: 465,   // SMTP Port
    secure: true,           // true for 465, false for other ports
    auth: {
        user: 'clinic@healthconnectpro.in', // your SMTP username
        pass: '=[Vw~U#pSUIf'  // your SMTP password
    }
}

// Create a SMTP transporter object
let transporter = nodemailer.createTransport(mailConfig);




async function sendMail(mailOptions) {
    console.log(mailOptions)
    try {
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw error
            }
            console.log("info: ", info)
            return info
        });
    } catch (error) {
        console.error(`Failed to get invoice details: ${error.message}`);
        throw error
    }
}

// Export Modules
module.exports = {
    sendMail
  };