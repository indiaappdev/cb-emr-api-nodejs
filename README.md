# Email Invoice Service

A Node.js service that generates and sends PDF invoices via email. This service integrates with clinic management systems to fetch invoice details, generate PDFs, and send them to specified email addresses.

## Features

- PDF generation from HTML templates
- Dynamic data injection into templates
- Clinic data integration
- Email sending with PDF attachments

## Directory Structure

```
    cb-emr-api-nodejs
    ├── README.md
    ├── app.js
    ├── controllers
    │   ├── invoice_controller.js
    │   └── prescription_controller.js
    ├── docs
    │   └── setup
    │       ├── setup.sh
    │       └── setupREADME.md
    ├── middlewares
    │   └── validation_middleware.js
    ├── package-lock.json
    ├── package.json
    ├── puppeteer.config.cjs
    ├── routes
    │   └── mail_sender_routes.js
    ├── schemas
    │   └── mail_sender_schemas.js
    ├── templates
    │   ├── invoice_template_1.html
    │   └── prescription_template_1.html
    └── utils
        ├── common_helper.js
        ├── config.js
        ├── mailer.js
        └── request_handler.js
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

  ### Setup:
  - The [setupREADME.md](./docs/setup/setupREADME.md) file contains the initial setup steps that needs to followed.
  - Run the [setup.sh](./docs/setup/setup.sh) script to install required packages.

## Installation dependencies:

npm install

## Start the application:

npm start

## Acknowledgments

- Node.js
- Puppeteer
- Nodemailer
- Express.js