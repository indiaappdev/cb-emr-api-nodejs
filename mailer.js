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
let transporter = nodemailer.createTransport({
    ...mailConfig,
    pool: true, // Use connection pooling
    maxConnections: 5, // Limit the number of connections
    maxMessages: 100, // Limit the number of messages per connection
    rateLimit: 10 // Limit the number of messages per second
});


/**
 * Sends an email using the configured transporter
 * @param {Object} mailOptions - Options for the email to be sent
 * @returns {Promise<Object>} Response from the email server
 */
async function sendMail(mailOptions) {
    console.log('Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to.replace(/(?<=.{3}).(?=.*@)/g, '*'), // Mask email for logging
        body: mailOptions.text,
        subject: mailOptions.subject,
    });

    try {
        const response = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error(`sendMail::Failed to send email: ${error.message}`, {
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
}


// Export Modules
module.exports = {
    sendMail
  };