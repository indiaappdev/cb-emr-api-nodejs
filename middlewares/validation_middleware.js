const { validationResult } = require('express-validator');

/**
 * Middleware for request validation.
 *
 * @param {Object} request - the request object
 * @param {Object} response - the response object
 * @param {Function} next - the next function in the middleware chain
 * @return {Object} JSON response with validation error message and errors
 */
const validationMiddleware = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors
      .array()
      .map((err) =>
        extractedErrors.push({ 
            fieldName: err.path,
            fieldError: err.msg,
        })
      );
    const groupedErrors = {};
    extractedErrors.forEach((error) => {
      const { fieldName, fieldError } = error;
      if (groupedErrors.hasOwnProperty(fieldName)) {
        groupedErrors[fieldName].fieldError.push(fieldError);
      } else {
        groupedErrors[fieldName] = {
          fieldName,
          fieldError: [fieldError],
        };
      }
    });
    return response.status(400).json({
      message: 'Validation error',
      errors: Object.values(groupedErrors),
    });
  }
  next();
};

module.exports = validationMiddleware;
