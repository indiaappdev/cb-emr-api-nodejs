const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const prepareData = require("./prepareData");

const compileTemplate = async (templatePath, data) => {
  const filePath = path.resolve(templatePath);
  const templateContent = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(templateContent);
  return template(data);
};

const preparePdf = async (
  cons_id,
  pres_id,
  user_role = "dc",
  clinic_id
) => {
  // Define paths using __dirname for consistency
  const templateDir = path.join(__dirname,"templates");
  const outputPath = path.join(__dirname, "temp", "ePrescription.pdf");

  const data = await prepareData(cons_id, pres_id, user_role, clinic_id);

  // Parse the `medicine` field
  data.medicine = JSON.parse(data.medicine);

  let html;
  switch (pres_id) {
    case 1:
      html = await compileTemplate(path.join(templateDir, "template_1.html"), data);
      break;

    default:
      throw new Error("Invalid prescription ID");
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  return outputPath;
};

module.exports = preparePdf;
