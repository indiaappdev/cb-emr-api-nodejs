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
        'Failed to fetch details'
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

module.exports = { get_clinic_logo, get_details_by_invoiceNumber };