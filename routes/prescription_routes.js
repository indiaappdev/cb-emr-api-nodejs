// Import Required Packages
const {sendPrescription} = require('../services/ePrescription/sendPrescription');
const express = require('express');
const router = express.Router();


router.post("/sendPrescription", async (req, res) => {

    const requestBody = req.body;

    // Log the request body to the console
    // console.log(requestBody);


    // Respond with a message including part of the request
    if (
        requestBody.cons_id &&
        requestBody.pres_id &&
        requestBody.user_role &&
        requestBody.emailTo &&
        requestBody.clinic_id &&
        requestBody.subject &&
        requestBody.body
    ){
      console.log(sendPrescription);
      
        const data=await sendPrescription(requestBody)
        console.log(data);

        if(data){
          res.status(200).send({
            status: 1,
            message: "Prescription sent successfully",
            resp: data,
          });
        }
        
    }
})

module.exports = router;
