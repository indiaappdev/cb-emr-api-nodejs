/**
 * @fileoverview API integration module for handling clinic and invoice related data
 * @module request_handler
 */

const axios = require('axios');
// Base URLs for API endpoints
const commonApiBaseUrl = "https://testemr-api-php.cb-dev.in/api/commonapi"
const cliniApiBaseUrl = "https://testemr-api-php.cb-dev.in/api/clinicapi"


/**
 * Makes an API call with error handling and response processing
 * @param {string} url - The API endpoint URL
 * @param {string} errorMessage - Custom error message for logging
 * @returns {Promise<Object>} API response data or empty object on error
 */
async function makeApiCall(url, errorMessage) {
    try {
        const response = await axios.get(url);
        return response.data.status === '1' ? response.data : {};
    } catch (error) {
        console.error(`${errorMessage}: ${error.message}`);
        return {};
    }
}


/**
 * Fetches clinic details using invoice number
 * @param {string} invoiceNumber - Invoice number to fetch clinic details
 * @returns {Promise<Object>} Clinic details or empty object
 */
async function get_clinic_details_by_invoiceNumber(invoiceNumber) {
    return makeApiCall(
        `${cliniApiBaseUrl}/MoneyReceipt/get_clinic_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}`,
        'Failed to fetch clinic details'
    );
}


/**
 * Fetches clinic logo using client ID and filename
 * @param {string} clientId - Client identifier
 * @param {string} fileName - Logo file name
 * @returns {Promise<Object>} Logo data or empty object
 */
async function get_clinic_logo(clientId, fileName) {
    return makeApiCall(
        `${commonApiBaseUrl}/File_reader/read_file_content_clinic?clinicid=${clientId}&file=${fileName}`,
        'Failed to fetch clinic logo'
    );
}

/**
 * Fetches patient details using invoice number
 * @param {string} invoiceNumber - Invoice number to fetch patient details
 * @returns {Promise<Object>} Patient details or empty object
 */
async function get_patient_details_by_invoiceNumber(invoiceNumber) {
    return makeApiCall(
        `${cliniApiBaseUrl}/MoneyReceipt/get_patient_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}`,
        'Failed to fetch patient details'
    );
}

/**
 * Fetches invoice details using invoice number
 * @param {string} invoiceNumber - Invoice number to fetch invoice details
 * @returns {Promise<Object>} Invoice details or empty object
 */
async function view_invoice(invoiceNumber) {
    return makeApiCall(
        `${cliniApiBaseUrl}/PatientInvoice/view_invoice?invoiceNumber=${invoiceNumber}`,
        'Failed to view invoice'
    );
}

/**
 * Fetches invoice details using invoice number
 * @param {string} invoiceNumber - Invoice number to fetch invoice details
 * @returns {Promise<Object>} Invoice details or empty object
 */
async function get_invoice_details(invoiceNumber) {
    return makeApiCall(
        `${cliniApiBaseUrl}/MoneyReceipt/get_invoice_details?invoiceNumber=${invoiceNumber}`,
        'Failed to get invoice details'
    );
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
    console.log("starting...");
    const data = {};

    // First fetch clinic details as logo depends on it
    const clinicDetails = await get_clinic_details_by_invoiceNumber(invoiceNumber);
    
    // Fetch independent data in parallel for better performance
    const [patientDetails, invoiceView, invoiceDetails] = await Promise.all([
        get_patient_details_by_invoiceNumber(invoiceNumber),
        view_invoice(invoiceNumber),
        get_invoice_details(invoiceNumber)
    ]);

    // Process clinic details and construct address
    const { response: clinic } = clinicDetails;
    data.address = [
        clinic?.address_line_1,
        clinic?.city,
        clinic?.district,
        clinic?.pincode,
        clinic?.state
    ].filter(Boolean).join(', ');
    
    data.contact = clinic?.phonenumber_1 || '';
    data.clinic_name = clinic?.name || '';

    // Fetch and process clinic logo if available
    if (clinic?.logo) {
        const clientId = clinic.logo.split("_")[0];
        const clinicLogo = await get_clinic_logo(clientId, clinic.logo);
        data.logo = clinicLogo?.base64String || '';
    }

    // Process patient details
    const { response: patient } = patientDetails;
    data.patient_name = patient?.name || '';
    data.patient_address = patient?.address_line_1 || '';
    data.patient_city = patient?.locality || '';
    data.doctor_name = patient?.doctors_name || '';

    // Process invoice view
    const invoiceData = invoiceView.response?.[0] || {};
    data.date = invoiceData.create_datetime || '';
    data.service = invoiceData.fee_name || '';
    data.rate = invoiceData.fee_amount || '';
    data.unit = invoiceData.unit || '';
    data.amount = invoiceData.fee_total || '';

    // Process detailed invoice information
    const { response: invoice } = invoiceDetails;
    data.payment_mode = invoice?.payment_method || '';
    data.discount = invoice?.discount_amount || '';
    data.total = invoice?.total_amount || '';
    data.total_paid = invoice?.paid_amount || '';
    data.receipt_number = invoice?.receipt_no || '';

    return data;
}

module.exports = { composeData };