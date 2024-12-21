// Import Required Packages
const {sendInvoice} = require('../controllers/invoice_controller');
const validationMiddleware = require('../middlewares/validation_middleware')
const { invoiceValidationSchema } = require('../schemas/invoice_schemas')
const express = require('express');
const router = express.Router();

    
/**
 * Route handler for sending invoices
 */
router.post('/sendInvoice', invoiceValidationSchema, validationMiddleware, async (req, res) => {
    const startTime = Date.now(); // For request timing

    try {
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
module.exports = router;
