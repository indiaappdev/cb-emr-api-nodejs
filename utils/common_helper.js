/**
 * @fileoverview API integration module for handling clinic and invoice related data
 * @module request_handler
 */

const { config } = require('./config');
const fs = require('fs');
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

/**
 * Compiles a Handlebars template with the provided data.
 * 
 * @param {string} templatePath - Path to the Handlebars template file.
 * @param {Object} data - Data to inject into the template.
 * @returns {Promise<string>} The compiled template as a string.
 */
const compileTemplate = async (templatePath, data) => {
    try {
        // Resolve the absolute path to the template file
        const filePath = path.resolve(templatePath);
        // Read the template file content
        const templateContent = fs.readFileSync(filePath, "utf8");
        // Compile the template content into a Handlebars template
        const template = handlebars.compile(templateContent);
        // Use the compiled template to generate a string with the provided data
        return template(data);
    } catch (error) {
        console.error(`Error compiling template: ${error}`);
        throw error;
    }
};


/**
 * Asynchronously generates a PDF from the provided HTML template file with dynamic data.
 * @param {string} htmlTemplatePath - Path to HTML template
 * @param {string} outputPath - Path to generated PDF
 * @param {Object} data - Data to inject into template
 * @returns {Promise<string>} Path to generated PDF
 */
async function generatePDF(htmlTemplatePath, data, outputPath) {
    try {
        html = await compileTemplate(htmlTemplatePath, data);
        const browser = await puppeteer.launch({
            headless: 'new', // Use new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });
        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true
        });
        await browser.close();
        return true
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
}

/**
 * This method is responsible for merging the input variables
 * into the input text at the appropriate position.
 * @param {string} text - Template text
 * @param {Object} variables - Variables to merge
 * @returns {Promise<string>} Merged text
 */
const mergeVariables = async (text, variables) => {
    try {
        return Object.entries(variables).reduce((result, [key, value]) =>
            result.replace(new RegExp(`<<${key}>>`, "g"), value || ''),
            text
        );
    } catch (error) {
        console.error("Variable merge failed:", error);
        throw error;
    }
};


module.exports = {
    generatePDF,
    mergeVariables
};