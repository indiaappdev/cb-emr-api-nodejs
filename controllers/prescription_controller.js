/**
 * This file contains the prescription controller logic, responsible for preparing prescription data by fetching 
 * consultation, doctor, and clinic details. It handles API calls, data processing, and error handling for generating 
 * prescriptions.
 */
const fs = require("fs");
const path = require("path");
const { sendMail } = require("../utils/mailer")
const { generatePDF } = require("../utils/common_helper")
const { config } = require("../utils/config")
const { get_consultation_details_temp, get_doctor_details_temp, get_own_clinic_details_temp, get_clinic_logo } = require("../utils/request_handler")



/**
 * Prepares prescription data by fetching consultation, doctor, and clinic details.
 * 
 * @param {string} id - Unique identifier for the consultation.
 * @param {string} pres_id - Prescription ID related to the consultation.
 * @param {string} user_role - User role for authentication, default is "dc".
 * @param {string} clinic_id - Unique identifier for the clinic.
 * @returns {Promise<Object>} Prepared prescription data or throws an error if any of the fetch operations fail.
 */
const prepareData = async (env, id, pres_id, user_role = "dc", clinic_id) => {
    // console.log("called prepareData");
    try {
        // Fetch independent data in parallel for better performance
        const [consultation_details, doc_details] = await Promise.all([
            get_consultation_details_temp(env, id, pres_id, user_role),
            get_doctor_details_temp(env, id, user_role),
        ]);
        if ((consultation_details.status === 1) && (doc_details.status === 1)) {
            const data = consultation_details;
            data.response.doctors_name = doc_details.response.doctors_name;
            data.response.licence_number = doc_details.response.licence_number;
            data.response.degree = doc_details.response.degree;
            data.response.specialization = doc_details.response.specialization;

            const clinic_data = await get_own_clinic_details_temp(env, doc_details.response.id, clinic_id, user_role)
            if (clinic_data.status === 1) {
                data.response.clinic_name = clinic_data.response.name;

                data.response.address_line_1 = clinic_data.response.address_line_1;
                data.response.phonenumber_1 = clinic_data.response.phonenumber_1;
                data.response.phonenumber_2 = clinic_data.response.phonenumber_2;
                data.response.timings = clinic_data.response.timings;

                // Fetch and process clinic logo if available
                if (clinic_data?.response?.logo) {
                    const clinicLogo = await get_clinic_logo(env, clinic_id, clinic_data.response.logo);
                    data.response.clinicImg = clinicLogo?.base64String || '';
                }
                return data.response;
            } else {
                throw new Error(`Clinic details fetch Error: ${clinic_data.status} - ${clinic_data.message}`);
            }
        } else {
            if (consultation_details.status === 1) {
                throw new Error(`Consultation details fetch Error: ${consultation_details.status} - ${consultation_details.message}`);
            } else {
                throw new Error(`Doctor details fetch Error: ${doc_details.status} - ${doc_details.message}`);
            }
        }
    } catch (error) {
        console.error("Error preparing prescription data:", error.message);
        throw error
    }
}



/**
 * Sends a prescription to a specified email address.
 * 
 * This function prepares prescription data, generates a PDF, and sends it via email.
 * 
 * @param {Object} requestBody - Request body containing necessary information.
 * @param {string} requestBody.cons_id - Consultation ID.
 * @param {string} requestBody.pres_id - Prescription ID.
 * @param {string} requestBody.user_role - User role, default is "dc".
 * @param {string} requestBody.clinic_id - Clinic ID.
 * @param {string} requestBody.emailTo - Email address to send the prescription to.
 * @param {string} requestBody.subject - Email subject line, default is "ePrescription".
 * @param {string} requestBody.body - Email body content.
 * 
 * @returns {Promise} Promise that resolves to the result of the email sending operation.
 */
const sendPrescription = async (requestBody) => {
    let outputPath;
    try {
        const { 
            env,
            cons_id,
            pres_id,
            user_role,
            clinic_id,
            emailTo,
            subject,
            body } = requestBody;
        // Get data and generate PDF concurrently
        const templateFilePath = path.join(__dirname, '..', config.templateFileDir, config.prescriptionTemplateFileName);

        dataPrepStartTime = Date.now()
        const data = await prepareData(env, cons_id, pres_id, user_role, clinic_id);
        dataPrepDuration = Date.now() - dataPrepStartTime

        const prescriptionDirPath = path.join(__dirname, '..', config.fileDir);
        if (!fs.existsSync(prescriptionDirPath)) {
            fs.mkdirSync(prescriptionDirPath, { recursive: true });
        }
        outputPath = path.join(prescriptionDirPath, config.prescriptionFileName);
        // Parse the `medicine` field
        data.medicine = JSON.parse(data.medicine);

        pdfGenStartTime = Date.now()
        await generatePDF(templateFilePath, data, outputPath);
        pdfGenDuration = Date.now() - pdfGenStartTime

        mailSendingStartTime = Date.now()
        const mailOptions = {
            from: config.emailFrom,
            to: emailTo,
            subject: subject,
            text: body,
            attachments: [{
                filename: path.basename(outputPath),
                content: fs.readFileSync(outputPath)
            }]
        };
        mailResponse = await sendMail(mailOptions);
        mailSendingDuration = Date.now() - mailSendingStartTime

        processingTimes = {
            dataCollectionTime: `${dataPrepDuration/1000} s`,
            pdfGenerationTime: `${pdfGenDuration/1000} s`,
            mailSendingTime: `${mailSendingDuration/1000} s`
        }
        return {mailResponse, processingTimes};
    } catch (error) {
        // Log the error, assuming logger is set up for error reporting
        console.log("sendPrescription:: error - " + error.stack);
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

module.exports = {
    sendPrescription
};