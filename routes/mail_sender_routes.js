// Import Required Packages
const express = require('express');
const router = express.Router();
const { sendInvoice } = require('../controllers/invoice_controller');
const validationMiddleware = require('../middlewares/validation_middleware')
const { invoiceValidationSchema, prescriptionValidationSchema } = require('../schemas/mail_sender_schemas')
const { sendPrescription } = require('../controllers/prescription_controller');

/**
 * Route handler for sending invoices via email.
 * 
 * This route accepts a POST request with the invoice number, recipient email, 
 * email subject, and email body. It validates the input data, generates an 
 * invoice PDF, and sends it as an email attachment.
 */
router.post('/sendInvoice', invoiceValidationSchema, validationMiddleware, async (req, res) => {
  try {
    startTime = Date.now()
    const { invoice_number, emailTo, subject, body } = req.body;

    // Log request with sanitized data
    console.log('Processing invoice request:', {
      invoice_number,
      emailTo: emailTo.replace(/(?<=.{3}).(?=.*@)/g, '*'), // Mask email
      timestamp: new Date().toISOString()
    });

    // Send invoice
    const response = await sendInvoice(invoice_number, emailTo, subject, body);

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Success response
    return res.status(200).json({
      status: 1,
      message: `Email sent successfully to ${emailTo}`,
      response,
      metadata: {
        requestDuration: `${duration}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    // Error handling
    console.error('Invoice sending failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Determine appropriate error status
    const statusCode = error.code === 'INVALID_EMAIL' ? 400 : 500;

    return res.status(statusCode).json({
      status: 0,
      message: 'Failed to send invoice',
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  }
});


/**
 * This route is used to send a prescription via email.
 * It expects the following fields in the request body:
 * - cons_id: Consultation ID
 * - pres_id: Prescription ID
 * - user_role: Role of the user
 * - emailTo: Recipient email
 * - clinic_id: Clinic ID
 * - subject: Email subject template
 * - body: Email body template
 * 
 * If the request is successful, it responds with a status 200 and a success message.
 * If the request fails, it responds with an appropriate error status and message.
 */
router.post("/sendPrescription", prescriptionValidationSchema, validationMiddleware, async (req, res) => {
  try {
    startTime = Date.now()
    const requestBody = req.body;

    // Log request with sanitized data
    console.log('Processing Prescription request:', {
      pres_id: requestBody.pres_id,
      emailTo: requestBody.emailTo.replace(/(?<=.{3}).(?=.*@)/g, '*'), // Mask email
      timestamp: new Date().toISOString()
    });

    // Send prescription
    const response = await sendPrescription(requestBody)

    // Calculate request duration
    const duration = Date.now() - startTime;

    // Success response
    return res.status(200).json({
      status: 1,
      message: `Prescription Email sent successfully to ${requestBody.emailTo}`,
      resp: response,
      metadata: {
        requestDuration: `${duration}ms`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Error handling
    console.error('Prescription sending failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Determine appropriate error status
    const statusCode = error.code === 'INVALID_EMAIL' ? 400 : 500;

    return res.status(statusCode).json({
      status: 0,
      message: 'Failed to send Prescription',
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  }
})

module.exports = router;
