/**
 * This code defines an asynchronous function generatePDF that takes a path to an HTML template file and an object containing dynamic data.
 * It reads the HTML template, injects the dynamic data, launches a browser using Puppeteer, sets the content of
 * a new page with the modified HTML, generates a PDF from the rendered HTML, closes the browser,
 * and logs "PDF generated successfully!" when done.
 */
const fs = require('fs');
const path = require("path");
const puppeteer = require('puppeteer');
const { get_details_by_invoiceNumber, get_clinic_logo } = require('../utils/request_handler');
const { sendMail } = require('../utils/mailer');
const { config } = require('../utils/config');
const { generatePDF, mergeVariables } = require('../utils/common_helper')


// Generate PDF with dynamic data
const data = {
    logo: "data:image/image/png;base64,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",
    address: "Kolkata, KUPWARA, HARDA, 200, West Bengal", // get_clinic_details_by_invoiceNumber -> {response.response.address_line_1}, {response.response.city}, {response.response.district}, {response.response.pincode}, {response.response.state}
    contact: "8017410038", // get_clinic_details_by_invoiceNumber -> get_clinic_details_by_invoiceNumber -> {response.response.phonenumber_1}
    patient_name: "SUKANYA SAHU", //get_patient_details_by_invoiceNumber -> response.response.name
    patient_address: "GARIA", //get_patient_details_by_invoiceNumber -> response.response.address_line_1
    patient_city: "Kolkata", //get_patient_details_by_invoiceNumber -> response.response.locality
    invoice_number: "I1200016",
    date: "2024-04-02 08:57:42", //view_invoice -> response.response.create_datetime
    doctor_name: "Dr Sambhu Das Gupta", //get_patient_details_by_invoiceNumber -> response.response.doctors_name
    services: [{
        service: "Dr Sambhu Nath - book", // view_invoice -> response.response.fee_name 
        rate: "900.00", //view_invoice -> response.response.fee_amount
        unit: "1", //view_invoice -> response.response.unit
        amount: "900.00", //view_invoice -> response.response.fee_total
    }],
    // payment_date: "2024-04-02 08:58:00", //get_invoice_details -> response.response.payment_create_date_time   
    // receipt_number: "HP232400000060", //get_invoice_details  -> response.response.receipt_no
    payment_mode: "Cash", //get_invoice_details  -> response.response.payment_method
    // payment_amount: "800.00", //get_invoice_details  -> response.response.paid_amount
    discount: "45.00", //get_invoice_details  -> response.response.discount_amount
    total: "1026.00", //get_invoice_details  -> response.response.total_amount
    total_paid: "800.00",   //get_invoice_details  -> response.response.paid_amount
}





/**
 * Composes complete data object by fetching and combining data from multiple APIs
 * @param {string} invoiceNumber - Invoice number to compose data for
 * @returns {Promise<Object>} Combined data object containing all relevant information
 * @property {string} address - Complete clinic address
 * @property {string} contact - Clinic contact number
 * @property {string} clinic_name - Name of the clinic
 * @property {string} logo - Base64 encoded clinic logo
 * @property {string} patient_name - Name of the patient
 * @property {string} patient_address - Patient's address
 * @property {string} patient_city - Patient's city
 * @property {string} doctor_name - Name of the doctor
 * @property {string} date - Invoice creation date
 * @property {string} service - Service provided
 * @property {string} rate - Service rate
 * @property {string} unit - Service units
 * @property {string} amount - Total amount
 * @property {string} payment_mode - Mode of payment
 * @property {string} discount - Discount amount
 * @property {string} total - Total amount
 * @property {string} total_paid - Amount paid
 * @property {string} receipt_number - Receipt number
 */
async function composeData(invoiceNumber) {
    const data = {};
    // First fetch details as logo depends on it
    const details = await get_details_by_invoiceNumber(invoiceNumber);
    if (details.status === 1) {
        const clinicDetails = details.data.clinicDetails
        const patientDetails = details.data.patientDetails
        const invoiceDetails = details.data.invoiceDetails

        // Process client details
        data.address = [
            clinicDetails?.address_line_1,
            clinicDetails?.city,
            clinicDetails?.district,
            clinicDetails?.pincode,
            clinicDetails?.state
        ].filter(Boolean).join(', ');
        data.contact = clinicDetails?.phonenumber_1 || '';
        data.clinic_name = clinicDetails?.name || '';

        // Fetch and process clinic logo if available
        if (clinicDetails?.logo) {
            const clientId = clinicDetails.clinic_id;
            const clinicLogo = await get_clinic_logo(clientId, clinicDetails.logo);
            data.logo = clinicLogo?.base64String || '';
        }

        // Process patient details
        data.patient_name = patientDetails?.patient_name || '';
        data.patient_address = patientDetails?.patient_address || '';
        data.patient_city = patientDetails?.patient_locality || '';
        data.doctor_name = patientDetails?.doctors_name || '';

        // Process invoice view
        data.date = invoiceDetails.invoice_create_datetime || '';
        if (Array.isArray(invoiceDetails) && invoiceDetails.length > 0) {
            data.services = invoiceDetails.map(({ 
                fee_name = '', 
                fee_amount = '', 
                unit = '', 
                fee_total = '', 
                discount_amount = '',
                total_amount = '',
                paid_amount = '',
                payment_method = '' 
            }) => {
                return {
                    service: fee_name,
                    rate: fee_amount,
                    unit,
                    amount: fee_total,
                    discount: discount_amount,
                    total: total_amount,
                    total_paid: paid_amount,
                    payment_mode: payment_method,
                };
            });
        } else {
            console.error('invoiceDetails is not a valid array or is empty.');
            data.services = []; // Set to an empty array if no valid data
        }
        // Process detailed invoice information
        data.receipt_number = invoiceDetails[0]?.receipt_no || '';
        return data;
    } else {
        throw new Error(`Error: ${details.status} - ${details.message}`);
    }
}


/**
 * Sends invoice via email with PDF attachment
 * @param {string} invoice_number - Invoice number
 * @param {string} emailTo - Recipient email
 * @param {string} subject - Email subject template
 * @param {string} body - Email body template
 * @returns {Promise<Object>} Email send response
 */
const sendInvoice = async (invoice_number, emailTo, subject, body) => {
    let outputPath;
    try {
        // Get data and generate PDF concurrently
        const templateFilePath = path.join(__dirname, '..', config.templateFileDir, config.invoiceTemplateFileName);
        const data = await composeData(invoice_number);
        const invoiceDirPath = path.join(__dirname, '..', config.fileDir);
        if (!fs.existsSync(invoiceDirPath)) {
            fs.mkdirSync(invoiceDirPath, { recursive: true });
        }
        const outputPath = path.join(invoiceDirPath, config.invoiceFileName);
        await generatePDF(templateFilePath, {
            invoice_number,
            ...data
        }, outputPath);

        // Process email content concurrently
        const [mergedSubject, mergedBody] = await Promise.all([
            mergeVariables(subject, data),
            mergeVariables(body, data)
        ]);

        const mailOptions = {
            from: config.emailFrom,
            to: emailTo,
            subject: mergedSubject,
            text: mergedBody,
            attachments: [{
                filename: path.basename(outputPath),
                content: fs.readFileSync(outputPath)
            }]
        };

        return await sendMail(mailOptions);
    } catch (error) {
        console.error("Invoice sending failed:", error.stack);
        throw error;
    } finally {
        // Cleanup generated PDF using synchronous deletion
        if (outputPath && fs.existsSync(outputPath)) {
            try {
                fs.unlinkSync(outputPath);
            } catch (err) {
                console.warn("PDF cleanup failed:", err);
            }
        }
    }
};


// Export Modules
module.exports = {
    sendInvoice
};