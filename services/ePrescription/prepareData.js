const baseUrl = "https://testemr-api-php.cb-dev.in"

const prepareData=async (id, pres_id, user_role = "dc",clinic_id)=>{
  // console.log("called prepareData");
  
    try {
        const response = await fetch(
          `${baseUrl}/api/clinicapi/PatientPrescription/get_consultation_details_temp?id=${id}&prescription_id=${pres_id}&user_role=${user_role}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const data = await response.json();
    
        const doctor_details = await fetch(
          `${baseUrl}/api/clinicapi/PatientPrescription/get_doctor_details_temp?id=${id}&user_role=${user_role}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const doc_details=await doctor_details.json()
    
        data.response.doctors_name=doc_details.response.doctors_name;
        data.response.licence_number=doc_details.response.licence_number;
        data.response.degree=doc_details.response.degree;
        data.response.specialization=doc_details.response.specialization;
        // console.log(await doctor_details);
    
        // console.log(doc_details);
        
    
        const clinic_res = await fetch(
          `${baseUrl}/api/clinicapi/PatientPrescription/get_own_clinic_details_temp?doctorsid=${doc_details.response.id}&clinicid=${clinic_id}&user_role=${user_role}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // console.log(await clinic_res.json());
        const clinic_data = await clinic_res.json();
    
        data.response.clinic_name=clinic_data.response.name;
    
        data.response.address_line_1=clinic_data.response.address_line_1;
        data.response.phonenumber_1=clinic_data.response.phonenumber_1;
        data.response.phonenumber_2=clinic_data.response.phonenumber_2; 
        data.response.timings=clinic_data.response.timings;
        
        // console.log(clinic_data.response.logo);
        
    
        const clinic_img = await fetch(
          `${baseUrl}/api/commonapi/File_reader/read_file_content_clinic?clinicid=${clinic_id}&file=${clinic_data.response.logo}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // console.log((await clinic_img.json()).base64String);
        
    
        // console.log("buffer file = ",(await clinic_img.json()).base64String);
        
        // console.log(data.response);
        
        data.response.clinicImg=(await clinic_img.json()).base64String;
    
        return data.response;
      } catch (error) {
        console.error("Error fetching consultation details:", error.message);
      }
}

module.exports=prepareData