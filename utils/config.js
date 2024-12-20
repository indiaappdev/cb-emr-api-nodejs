// Configuration object with all app settings
const config = {
    // Server Configuration
    port: 3000,
    environment: 'development',
    
    // File Paths
    uploadsPath: './uploads',
    logsPath: './logs',
    
    // Mail Configuration 
    mailConfig: {
        // host: 'pinnacle.herosite.pro', // SMTP Host
        host: 'mail.healthconnectpro.in', // SMTP Host
        port: 465,   // SMTP Port
        secure: true,           // true for 465, false for other ports
        auth: {
            user: 'clinic@healthconnectpro.in', // your SMTP username
            pass: '6n*_fhVG;7G%'  // your SMTP password
        }
    },
    emailFrom: "clinic@healthconnectpro.in",
    
    // url configs
    commonApiBaseUrl: "https://testemr-api-php.cb-dev.in/api/commonapi",
    cliniApiBaseUrl: "https://testemr-api-php.cb-dev.in/api/clinicapi",

    // extra configs
    templateFileDir: "static",
    templateFileName: "styled_invoice.html",
    invoiceFileDir: "uploads",
    invoiceFileName: "invoice.pdf"
};

module.exports = {
    config
};
