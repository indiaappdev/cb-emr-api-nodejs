// Start processing
const fs=require("fs");
const path=require("path");
const {sendMail}=require("../../utils/mailer")
// import { sendMail } from "../mailer";
const preparePdf=require("./preparePdf")
const sendPrescription = async (
  requestBody
) => {
  // console.log(requestBody);
  
  const {cons_id,
    pres_id,
    user_role,
    clinic_id,
    emailTo,
    subject,
    body}=requestBody;
  // console.log("called send");
  
  try {
    // Assuming the invoice number is known
    const emailFrom = "clinic@healthconnectpro.in";
    // data = await composeData(invoice_number);
    // console.log("sendInvoice:: data - ", data);
    const outputPath = await preparePdf(cons_id, pres_id,user_role, clinic_id);

    let mailOptions = {
      from: emailFrom, // sender address
      to: emailTo, // list of receivers
      subject: subject || "ePrescription", // Subject line
      text: body, // plain text body
      attachments: [
        {
          filename: path.basename(outputPath),
          content: fs.readFileSync(outputPath),
        },
      ], // plain text body
    };
    const resp = await sendMail(mailOptions);
    return resp;
    // return "mail sent successfully!"
  } catch (error) {
    // Log the error, assuming logger is set up for error reporting
    console.log("sendInvoice:: error - " + error.stack);
    throw error;
  }
};

module.exports=sendPrescription