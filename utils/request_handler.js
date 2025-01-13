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
        const response = await axios.get(
            url,
            {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.status === 1 ? response.data : { status: response.data.status, message: response.data.message || '' };
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
async function get_details_by_invoiceNumber(env, invoiceNumber, user_role = "dc") {
    const cliniApiBaseUrl = config[env].cliniApiBaseUrl;
    return makeApiCall(
        `${cliniApiBaseUrl}/MoneyReceipt/get_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}&user_role=${user_role}`,
        'Failed to fetch details'
    );
}



/**
 * Fetches clinic logo using client ID and filename
 * @param {string} clientId - Client identifier
 * @param {string} fileName - Logo file name
 * @returns {Promise<Object>} Logo data or empty object
 */
async function get_clinic_logo(env, clientId, fileName) {
    const commonApiBaseUrl = config[env].commonApiBaseUrl;
    return makeApiCall(
        `${commonApiBaseUrl}/File_reader/read_file_content_clinic?clinicid=${clientId}&file=${fileName}`,
        'Failed to fetch clinic logo'
    );
}


/**
 * Fetches consultation details temporarily using ID and prescription ID
 * @param {string} id - Unique identifier for the consultation
 * @param {string} pres_id - Prescription ID related to the consultation
 * @param {string} user_role - User role for authentication, default is "dc"
 * @returns {Promise<Object>} Consultation details or empty object on failure
 */
async function get_consultation_details_temp(env, id, pres_id, user_role = "dc") {
    const cliniApiBaseUrl = config[env].cliniApiBaseUrl;
    return makeApiCall(
        `${cliniApiBaseUrl}/PatientPrescription/get_consultation_details_temp?id=${id}&prescription_id=${pres_id}&user_role=${user_role}`,
        'Failed to fetch consultation details'
    );
}


/**
 * Fetches doctor details temporarily using ID and user role
 * @param {string} id - Unique identifier for the doctor
 * @param {string} user_role - User role for authentication, default is "dc"
 * @returns {Promise<Object>} Doctor details or empty object on failure
 */
async function get_doctor_details_temp(env, id, user_role = "dc") {
    const cliniApiBaseUrl = config[env].cliniApiBaseUrl;
    return makeApiCall(
        `${cliniApiBaseUrl}/PatientPrescription/get_doctor_details_temp?id=${id}&user_role=${user_role}`,
        'Failed to fetch doctor details'
    );
}



/**
 * Fetches own clinic details temporarily using doctor ID, clinic ID, and user role
 * @param {string} doctor_id - Unique identifier for the doctor
 * @param {string} clinic_id - Unique identifier for the clinic
 * @param {string} user_role - User role for authentication, default is "dc"
 * @returns {Promise<Object>} Own clinic details or empty object on failure
 */
async function get_own_clinic_details_temp(env, doctor_id, clinic_id, user_role = "dc") {
    const cliniApiBaseUrl = config[env].cliniApiBaseUrl;
    return makeApiCall(
        `${cliniApiBaseUrl}/PatientPrescription/get_own_clinic_details_temp?doctorsid=${doctor_id}&clinicid=${clinic_id}&user_role=${user_role}`,
        'Failed to fetch own clinic details'
    );
}


module.exports = {
    get_clinic_logo,
    get_details_by_invoiceNumber,
    get_consultation_details_temp,
    get_doctor_details_temp,
    get_own_clinic_details_temp
};