const express = require('express');
const cors = require('cors');
const { config } = require('./utils/config')
const { mountRoutes } = require('./routes')
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
app.get('/home', (request, response) => {
    response.status(200).send(`<center><h1>Mailer App</h1></center>`);
    });


// Initialize Routes
mountRoutes(app);
    
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});



// Export the Express API
module.exports = app