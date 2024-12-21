const { checkSchema } = require('express-validator');

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