const axios = require('axios');
const commonApiBaseUrl = "https://testemr-api-php.cb-dev.in/api/commonapi"
const cliniApiBaseUrl = "https://testemr-api-php.cb-dev.in/api/clinicapi"



// Define API call functions, each returning data or handling errors by returning default values
async function get_clinic_details_by_invoiceNumber(invoiceNumber) {
    try {
        const response = await axios.get(`${cliniApiBaseUrl}/MoneyReceipt/get_clinic_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}`);
        // console.log(response.data)
        if (response.data.status == '1') {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Failed to fetch clinic details: ${error.message}`);
        return {};  // Return an empty object in case of error
    }
}



// Define API call functions, each returning data or handling errors by returning default values
async function get_clinic_logo(clientId, fileName) {
    try {
        const response = await axios.get(`${commonApiBaseUrl}/File_reader/read_file_content_clinic?clinicid=${clientId}&file=${fileName}`);
        // console.log(response.data)
        if (response.data.status == '1') {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Failed to fetch clinic logo: ${error.message}`);
        return {};  // Return an empty object in case of error
    }
}

/**
 * Retrieves the details of a patient by invoice number.
 *
 * @param {string} invoiceNumber - The invoice number to fetch patient details for.
 * @return {Promise<Object>} A promise that resolves to the patient details object if successful, or an empty object if unsuccessful.
 */
async function get_patient_details_by_invoiceNumber(invoiceNumber) {
    try {
        const response = await axios.get(`${cliniApiBaseUrl}/MoneyReceipt/get_patient_details_by_invoiceNumber?invoiceNumber=${invoiceNumber}`);
        // console.log(response.data)
        if (response.data.status == '1') {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Failed to fetch patient details: ${error.message}`);
        return {};
    }
}

/**
 * Retrieves the details of an invoice from the server.
 *
 * @param {string} invoiceNumber - The invoice number.
 * @return {Promise<Object>} A promise that resolves to the invoice details object if successful, or an empty object if unsuccessful.
 */
async function view_invoice(invoiceNumber) {
    try {
        const response = await axios.get(`${cliniApiBaseUrl}/PatientInvoice/view_invoice?invoiceNumber=${invoiceNumber}`);
        // console.log(response.data)
        if (response.data.status == '1') {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Failed to view invoice: ${error.message}`);
        return {};
    }
}

/**
 * Retrieves the details of an invoice from the server.
 *
 * @param {string} invoiceNumber - The invoice number.
 * @return {Promise<Object>} A promise that resolves to the invoice details object if successful, or an empty object if unsuccessful.
 */
async function get_invoice_details(invoiceNumber) {
    try {
        const response = await axios.get(`${cliniApiBaseUrl}/MoneyReceipt/get_invoice_details?invoiceNumber=${invoiceNumber}`);
        // console.log(response.data)
        if (response.data.status == '1') {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error(`Failed to get invoice details: ${error.message}`);
        return {};
    }
}


/**
 * Asynchronously composes data for a given invoice number.
 *
 * @param {string} invoiceNumber - The invoice number to compose data for.
 * @return {Promise<Object>} A promise that resolves to an object containing the composed data.
 * The object contains the following properties:
 * - address: The address of the clinic, with available or default values.
 * - contact: The contact number of the clinic, with available or default values.
 * - logo: The base64-encoded logo of the clinic, with available or default values.
 * - patient_name: The name of the patient, with available or default values.
 * - patient_address: The address of the patient, with available or default values.
 * - patient_city: The city of the patient, with available or default values.
 * - doctor_name: The name of the doctor, with available or default values.
 * - date: The creation date of the invoice, with available or default values.
 * - service: The name of the service provided, with available or default values.
 * - rate: The rate of the service, with available or default values.
 * - unit: The unit of the service, with available or default values.
 * - amount: The total amount of the service, with available or default values.
 * - payment_mode: The payment mode used for the invoice, with available or default values.
 * - discount: The discount amount applied to the invoice, with available or default values.
 * - total: The total amount of the invoice, with available or default values.
 * - total_paid: The total amount paid for the invoice, with available or default values.
 */
async function composeData(invoiceNumber) {
    console.log("starting...")
    const data = {};  // Initialize the data object

    // Get clinic details and fill in the data object with available or default values
    const clinicDetails = await get_clinic_details_by_invoiceNumber(invoiceNumber);
    data.address = `${clinicDetails.response?.address_line_1 || ''}, ${clinicDetails.response?.city || ''}, ${clinicDetails.response?.district || ''}, ${clinicDetails.response?.pincode || ''}, ${clinicDetails.response?.state || ''}`;
    data.contact = clinicDetails.response?.phonenumber_1 || '';
    data.clinic_name = clinicDetails.response?.name || '';

    // Get clinic logo
    const logoFileName = clinicDetails.response?.logo || null;
    if (logoFileName) {
        const clientId = logoFileName.split("_")[0]
        // console.log("logoFileName:: ",logoFileName)
        // console.log("clientId:: ",clientId)
        const clinicLogo = await get_clinic_logo(clientId, clinicDetails.response?.logo);
        data.logo = clinicLogo?.base64String || '';
    }
    // Get patient details
    const patientDetails = await get_patient_details_by_invoiceNumber(invoiceNumber);
    data.patient_name = patientDetails.response?.name || '';
    data.patient_address = patientDetails.response?.address_line_1 || '';
    data.patient_city = patientDetails.response?.locality || '';
    data.doctor_name = patientDetails.response?.doctors_name || '';

    // View invoice details
    const invoiceView = await view_invoice(invoiceNumber);
    data.date = invoiceView.response?.[0]?.create_datetime || '';
    data.service = invoiceView.response?.[0]?.fee_name || '';
    data.rate = invoiceView.response?.[0]?.fee_amount || '';
    data.unit = invoiceView.response?.[0]?.unit || '';
    data.amount = invoiceView.response?.[0]?.fee_total || '';

    // Get further invoice details
    const invoiceDetails = await get_invoice_details(invoiceNumber);
    data.payment_mode = invoiceDetails.response?.payment_method || '';
    data.discount = invoiceDetails.response?.discount_amount || '';
    data.total = invoiceDetails.response?.total_amount || '';
    data.total_paid = invoiceDetails.response?.paid_amount || '';
    data.receipt_number = invoiceDetails.response?.receipt_no || '';

    // console.log(data);
    return data;
}

// export default composeData
// Export Modules
module.exports = {
    composeData
  };