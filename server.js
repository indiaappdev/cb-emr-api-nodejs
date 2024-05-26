const express = require('express');
const cors = require('cors');
const {sendInvoice} = require('./dynamic_test');
const PORT = 3000;



// Instantiate Express.JS
const app = express();


// Enable CORS Middleware
app.use(cors());

// Setup Static Public Directory
app.use(express.static('public'));

// Enable Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Create A Default Route
app.get('/', (request, response) => {
    response.status(200).send(`<center><h1>Mailer App</h1></center>`);
    });

      
// Define a POST route
app.post('/sendInvoice', async (req, res) => {
    try{
        // Assuming the invoice number is known
        // invoice_number = 'I1200054'
        // emailTo = "royguddubsc@gmail.com"
        // subject = "Payment receipt <<receipt_number>>"
        // body = "Please find attached payment receipt for the payment on <<date>> at <<clinic_name>>"
        
        const requestBody = req.body;

        // Log the request body to the console
        console.log(requestBody);

        // Respond with a message including part of the request
        if (requestBody.invoice_number && requestBody.emailTo && requestBody.subject && requestBody.body) {
            resp = await sendInvoice(requestBody.invoice_number, requestBody.emailTo, requestBody.subject, requestBody.body)
            res.status(200).send({"status": 1, "message": "email sent to " + requestBody.emailTo, "resp": resp});
        } else {
            res.status(400).send({"status": 0, "message": 'Missing information'});
        }
    } catch (error) {
            // Log the error, assuming logger is set up for error reporting
            console.log("send email:: error - " + error.stack);
            res.status(500).send({"status": 0, "message": error.stack});
          }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});



// Export the Express API
module.exports = app