const { checkSchema } = require('express-validator');

/**
 * Defines the validation schema for invoice data.
 * 
 * This schema validates the following fields:
 * - invoice_number: Ensures it is a non-empty string.
 * - emailTo: Validates it as a non-empty, valid email address, and normalizes it to lowercase.
 * - subject: Ensures it is a non-empty string.
 * - body: Ensures it is a non-empty string.
 * 
 * @returns {Object} Validation schema for invoice data.
 */
exports.invoiceValidationSchema = checkSchema({
    invoice_number: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Invoice number is required'
        },
        isString: {
            errorMessage: 'Invoice number must be a string'
        }
    },
    emailTo: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Email address is required'
        },
        isEmail: {
            errorMessage: 'Must be a valid email address'
        },
        normalizeEmail: {
            options: {
                lowercase: true,
                remove_dots: false,
                remove_extension: false
            }
        }
    },
    subject: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Subject is required'
        },
        isString: {
            errorMessage: 'Subject must be a string'
        }
    },
    body: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Body content is required'
        },
        isString: {
            errorMessage: 'Body must be a string'
        }
    }
});