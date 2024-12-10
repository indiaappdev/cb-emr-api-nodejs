# Email Invoice Service

A Node.js service that generates and sends PDF invoices via email. This service integrates with clinic management systems to fetch invoice details, generate PDFs, and send them to specified email addresses.

## Features

- PDF generation from HTML templates
- Dynamic data injection into templates
- Clinic data integration
- Email sending with PDF attachments

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation dependencies:

npm install

## API Endpoints

### Send Invoice Email

**POST** */sendInvoice*

#### Request Body
```
{
    "invoice_number": "I1200054",
    "emailTo": "recipient@example.com",
    "subject": "Payment receipt <<receipt_number>>",
    "body": "Please find attached payment receipt for the payment on <<date>> at <<clinic_name>>"
}
```

#### Response
```
{
    "status": 1,
    "message": "email sent to recipient@example.com",
    "resp": {
        "messageId": "...",
        "response": "..."
    }
}
```


## Usage

1. Start the server:
    ```
    npm start
    ```
2. Send a request to generate and email an invoice:
    ```
    curl -X POST http://localhost:3000/sendInvoice \
    -H "Content-Type: application/json" \
    -d '{
        "invoice_number": "I1200054",
        "emailTo": "recipient@example.com",
        "subject": "Payment receipt <<receipt_number>>",
        "body": "Please find attached payment receipt for the payment on <<date>> at <<clinic_name>>"
    }'
    ```

## Template Variables

The following variables can be used in email subject and body:

- `<<receipt_number>>`: Invoice receipt number
- `<<date>>`: Payment date
- `<<clinic_name>>`: Name of the clinic
- `<<patient_name>>`: Name of the patient
- `<<total_paid>>`: Amount paid
- `<<address>>`: Clinic address
- `<<contact>>`: Clinic contact
- `<<patient_address>>`: Patient address
- `<<patient_city>>`: Patient city
- `<<doctor_name>>`: Doctor name
- `<<service>>`: Service name
- `<<rate>>`: Service rate
- `<<unit>>`: Service units
- `<<amount>>`: Service amount
- `<<payment_mode>>`: Payment mode
- `<<discount>>`: Discount amount
- `<<total>>`: Total amount

## Error Handling

The service includes comprehensive error handling for:
- Invalid input data
- PDF generation failures
- Email sending failures

## Acknowledgments

- Node.js
- Puppeteer
- Nodemailer
- Express.js