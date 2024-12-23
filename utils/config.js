// Configuration object with all app settings
const config = {
    // Server Configuration
    port: 3000,
    environment: 'development',
    
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
    templateFileDir: "templates",
    invoiceTemplateFileName: "invoice_template_1.html",
    prescriptionTemplateFileName: "prescription_template_1.html",
    fileDir: "uploads",
    invoiceFileName: "invoice.pdf",
    prescriptionFileName: "prescription.pdf"
};

module.exports = {
    config
};
