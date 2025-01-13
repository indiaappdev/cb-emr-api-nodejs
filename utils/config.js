// Configuration object with all app settings
require
const config = {
    
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
    // extra configs
    templateFileDir: "templates",
    invoiceTemplateFileName: "invoice_template_1.html",
    prescriptionTemplateFileName: "prescription_template_1.html",
    fileDir: "uploads",
    invoiceFileName: "invoice.pdf",
    prescriptionFileName: "prescription.pdf",
    
    // env dependant configs 
    test: {
        // Server Configuration
        port: 3000,

        // url configs
        commonApiBaseUrl: "https://testemr-api-php.cb-dev.in/api/commonapi",
        cliniApiBaseUrl: "https://testemr-api-php.cb-dev.in/api/clinicapi",
    },
    live: {
        // Server Configuration
        port: 3000,
        
        // url configs
        commonApiBaseUrl: "https://emr-api.healthconnectpro.in/api/commonapi",
        cliniApiBaseUrl: "https://emr-api.healthconnectpro.in/api/clinicapi",
    }

};

module.exports = {
    config
};
