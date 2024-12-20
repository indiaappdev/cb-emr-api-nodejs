const {sendInvoice} = require('../controllers/invoice_controller');

// Import Required Packages
const express = require('express');
const router = express.Router();
    
/**
 * Schema for request validation
 */
const invoiceRequestSchema = {
    invoice_number: { type: 'string', required: true },
    emailTo: { type: 'string', required: true, format: 'email' },
    subject: { type: 'string', required: true },
    body: { type: 'string', required: true }
};

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates request body against schema
 * @param {Object} body
 * @returns {Object} { isValid, errors }
 */
const validateRequest = (body) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(invoiceRequestSchema)) {
        if (rules.required && !body[field]) {
            errors.push(`${field} is required`);
            continue;
        }
        
        if (rules.format === 'email' && !isValidEmail(body[field])) {
            errors.push(`${field} must be a valid email`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Route handler for sending invoices
 */
router.post('/sendInvoice', async (req, res) => {
    const startTime = Date.now(); // For request timing

    try {
        // Request validation
        const { isValid, errors } = validateRequest(req.body);
        if (!isValid) {
            return res.status(400).json({
                status: 0,
                message: 'Validation failed',
                errors
            });
        }

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
