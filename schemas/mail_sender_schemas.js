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


/**
 * Defines the validation schema for sending a prescription.
 * 
 * This schema validates the following fields:
 * - cons_id: Ensures it is a non-empty string.
 * - pres_id: Ensures it is a non-empty string.
 * - user_role: Ensures it is a non-empty string.
 * - emailTo: Validates it as a non-empty, valid email address, and normalizes it to lowercase.
 * - clinic_id: Ensures it is a non-empty string.
 * - subject: Ensures it is a non-empty string.
 * - body: Ensures it is a non-empty string.
 * 
 * @returns {Object} Validation schema for sending a prescription.
 */
exports.prescriptionValidationSchema = checkSchema({
    cons_id: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Consultation ID is required'
        },
        isString: {
            errorMessage: 'Consultation ID must be a string'
        }
    },
    pres_id: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Prescription ID is required'
        },
        isString: {
            errorMessage: 'Prescription ID must be a string'
        }
    },
    user_role: {
        in: ['body'],
        trim: true,
        optional: { options: { nullable: true } }, // Allow user_role to be optional
        isString: {
            errorMessage: 'User role must be a string'
        },
        // Custom validation to set default value
        custom: {
            options: (value, { req }) => {
                if (!value) {
                    req.body.user_role = 'dc'; // Set default value
                }
                return true; // Indicate that validation passed
            }
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
    clinic_id: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Clinic ID is required'
        },
        isString: {
            errorMessage: 'Clinic ID must be a string'
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