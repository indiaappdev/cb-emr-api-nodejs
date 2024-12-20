/**
 * @fileoverview API integration module for handling clinic and invoice related data
 * @module request_handler
 */

const axios = require('axios');
const { config } = require('./config');


/**
 * Makes an API call with error handling and response processing
 * @param {string} url - The API endpoint URL
 * @param {string} errorMessage - Custom error message for logging
 * @returns {Promise<Object>} API response data or empty object on error
 */
async function makeApiCall(url, errorMessage) {
    try {
        const response = await axios.get(url);
        return response.data.status === 1 ? response.data : {};
    } catch (error) {
        console.error(`${errorMessage}: ${error.message}`);
        return {};
    }
}

/**
 * Fetches all details using invoice number
 * @param {string} invoiceNumber - Invoice number to fetch all details
 * @returns {Promise<Object>} All details or empty object
 */
async function get_details_by_invoiceNumber(invoiceNumber) {
    return makeApiCall(
        `${config.cliniApiBaseUrl}/MoneyReceipt/get_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}`,
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
        `${config.commonApiBaseUrl}/File_reader/read_file_content_clinic?clinicid=${clientId}&file=${fileName}`,
        'Failed to fetch clinic logo'
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

    // First fetch details as logo depends on it
    const details = await get_details_by_invoiceNumber(invoiceNumber);
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
    data.service = invoiceDetails.fee_name || '';
    data.rate = invoiceDetails.fee_amount || '';
    data.unit = invoiceDetails.unit || '';
    data.amount = invoiceDetails.fee_total || '';

    // Process detailed invoice information
    data.payment_mode = invoiceDetails?.payment_method || '';
    data.discount = invoiceDetails?.discount_amount || '';
    data.total = invoiceDetails?.total_amount || '';
    data.total_paid = invoiceDetails?.paid_amount || '';
    data.receipt_number = invoiceDetails?.receipt_no || '';

    return data;
}

module.exports = { composeData };