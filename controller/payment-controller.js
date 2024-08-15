const paytmchecksum = require("./paytmChecksum.js");
const formidable = require("formidable");
const https = require("https");
const { v4: uuid } = require("uuid");
const UserSchema = require("../models/UserSchema");
const axios = require("axios");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { Console } = require("console");

const addPaymentGateway = async (request, response) => {

  console.log('1......................................................');

  var name = request.body.name;
  var age = request.body.age;
  var gender = request.body.gender;
  var Institution = request.body.Institution;
  var yearofStudy = request.body.yearofStudy;
  var streetName = request.body.streetName;
  var city = request.body.city;
  var state = request.body.state;
  var password = request.body.password;
  var email = request.body.email;
  var isAdmin = request.body.isAdmin;
  var profilePic = request.body.profilePic;
  var UploadFile = request.body.UploadFile;
  var phoneNumber = request.body.phoneNumber;
  var BasicAmount = request.body.BasicAmount;
  var Roles = request.body.Roles;
  var Designation = request.body.Designation;
  var Qualification = request.body.Qualification;
  var Speciality = request.body.Speciality;
  var Presentation = request.body.Presentation;
  var Speak = request.body.Speak;
  var biographyFiles = request.body.biographyFiles;
  var subjectofPresentation = request.body.subjectofPresentation;
  var AccompanyCount = request.body.AccompanyCount;
  var TotalAmount = request.body.TotalAmount;
  var CVFiles = request.body.CVFiles;

  let paytmMerchantkey = process.env.KEY;
  let paytmParams = {};
  (paytmParams["MID"] = process.env.MID),
    (paytmParams["WEBSITE"] = process.env.WEBSITE),
    (paytmParams["CHANNEL_ID"] = process.env.CHANNEL_ID),
    (paytmParams["INDUSTRY_TYPE_ID"] = process.env.INDUSTRY_TYPE_ID),
    (paytmParams["ORDER_ID"] = uuid()),
    (paytmParams["CUST_ID"] = `wdc2023${uuid()}`),
    (paytmParams["CALLBACK_URL"] = "http://localhost:4119/callback");
  paytmParams["TXN_AMOUNT"] = request.body.amount;


  console.log('2......................................................');
  const paytmCheckSum = await paytmchecksum.generateSignature(
    paytmParams,
    paytmMerchantkey
  );

  console.log('3......................................................');
  try {
    const params = {
      ...paytmParams,
      CHECKSUMHASH: paytmCheckSum,
      name: name,
      age: age,
      gender: gender,
      Institution: Institution,
      yearofStudy: yearofStudy,
      streetName: streetName,
      city: city,
      state: state,
      password: password,
      email: email,
      isAdmin: isAdmin,
      profilePic: profilePic,
      UploadFile: UploadFile,
      phoneNumber: phoneNumber,
      BasicAmount: BasicAmount,
      Roles: Roles,
      Designation: Designation,
      Qualification: Qualification,
      Speciality: Speciality,
      Presentation: Presentation,
      Speak: Speak,
      biographyFiles: biographyFiles,
      subjectofPresentation: subjectofPresentation,
      AccompanyCount: AccompanyCount,
      TotalAmount: TotalAmount,
      CVFiles: CVFiles,
    };
    response.json(params);
    console.log('4......................................................');
    axios.post("http://localhost:4119/router/register", params, {
      "content-type": "application/json",
    });
    console.log('5......................................................');
    console.log(params);
  } catch (error) {
    console.log('6......................................................');
    console.log(error);
  }
};

const paymentResponse = (request, response) => {
  console.log('7......................................................');
  const paytmCheckSum = request.body.CHECKSUMHASH;
  delete request.body.CHECKSUMHASH;

  const isVerifySignature = paytmchecksum.verifySignature(
    request.body,
    process.env.KEY,
    paytmCheckSum
  );
  console.log('8......................................................');
  if (isVerifySignature) {
    console.log('9......................................................');
    let paytmParams = {};
    paytmParams["MID"] = request.body.MID;
    paytmParams["ORDERID"] = request.body.ORDERID;

    paytmchecksum
      .generateSignature(paytmParams, process.env.KEY)
      .then(function (checksum) {
        paytmParams["CHECKSUMHASH"] = checksum;

        const post_data = JSON.stringify(paytmParams);

        const options = {
          hostname: "securegw-stage.paytm.in",
          port: 443,
          path: "/order/status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };
        console.log('10......................................................');
        let res = "";
        const post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            res += chunk;
          });
          console.log('11......................................................');

          post_res.on("end", function () {
            let result = JSON.parse(res);
            console.log('12......................................................');
            console.log(result.STATUS === "TXN_SUCCESS");

            if (result.STATUS === "TXN_SUCCESS") {
              const resultStatus = result.STATUS;
              console.log('13......................................................');
              var newValues = {
                $set: {
                  STATUS: resultStatus,
                  ORDER_ID: result.ORDERID,
                  TXNID: result.TXNID,
                  BANKTXNID: result.BANKTXNID,
                  TXNTYPE: result.TXNTYPE,
                  GATEWAYNAME: result.GATEWAYNAME,
                  RESPCODE: result.RESPCODE,
                  RESPMSG: result.RESPMSG,
                  BANKNAME: result.BANKNAME,
                  PAYMENTMODE: result.PAYMENTMODE,
                  REFUNDAMT: result.REFUNDAMT,
                  TXNDATE: result.TXNDATE,
                },
              };
              let query = { ORDER_ID: result.ORDERID };
              console.log(newValues);
              console.log(query);
              UserSchema.findOneAndUpdate(
                query,
                newValues,
                { new: true },
                (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("No Error!");
                  }
                  if (data == null) {
                    console.log("Nothing Found!");
                  } else {
                    console.log("Updated!");

                    const particles = async () => {
                      let ID = result.ORDERID;

                      let user = UserSchema.findOne(
                        { ORDER_ID: ID },
                        function (error, docs) {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log(docs.email);


                            function createInvoice( path) {
                              let doc = new PDFDocument({ size: "A5", margin: 50 });
                            
                              generateHeader(doc);
                              generateCustomerInformation(doc);
                            
                            
                              doc.end();
                              doc.pipe(fs.createWriteStream(path));
                            }
                            
                            function generateHeader(doc) {
                              doc.image("./logo.png", 50, 115, { width: 50 })
                               doc
                               .fillColor("#444444")
                               .font("Helvetica-Bold")
                               .fontSize(15)
                               .text("World Dental Conference 2023", 110, 57,{align:"center"})

                                .moveDown();
                            }
                            
                            function generateCustomerInformation(doc) {
                              doc
                                .fillColor("#444444")
                                .fontSize(20)
                                .text("Invoice", 50, 120);
                            
                              generateHr(doc, 150);
                            
                              const customerInformationTop = 170;
                            
                              doc
                                .fontSize(10)
                                .font("Helvetica-Bold")
                                .text("Name", 50, customerInformationTop)
                                .font("Helvetica")
                                .text(`: ${docs.name}`, 150, customerInformationTop)
                                .font("Helvetica-Bold")
                                .text("Email", 50, customerInformationTop + 15)
                                .font("Helvetica")
                                .text(`: ${docs.email}`, 150, customerInformationTop + 15)
                                .font("Helvetica-Bold")
                                .text("Phone Number", 50, customerInformationTop + 30)
                                .font("Helvetica")
                                .text(`: ${docs.phoneNumber}`,150,customerInformationTop + 30)
                                .font("Helvetica-Bold")
                                .text("Street Name", 50, customerInformationTop + 45)
                                .font("Helvetica")
                                .text(`: ${docs.streetName}`,150,customerInformationTop + 45)
                                .font("Helvetica-Bold")
                                .text("State", 50, customerInformationTop + 60)
                                .font("Helvetica")
                                .text(`: ${docs.state}`,150,customerInformationTop + 60)
                                .font("Helvetica-Bold")
                                .text("City", 50, customerInformationTop + 75)
                                .font("Helvetica")
                                .text(`: ${docs.city}`,150,customerInformationTop + 75)
                                .font("Helvetica-Bold")
                                .text("Transaction Amount", 50, customerInformationTop + 90)
                                .font("Helvetica")
                                .text(`: ${docs.TotalAmount}`,150,customerInformationTop + 90)
                                .font("Helvetica-Bold")
                                .text("Transaction ID", 50, customerInformationTop + 105)
                                .font("Helvetica")
                                .text(`: ${docs.TXNID}`,150,customerInformationTop + 105)
                                .font("Helvetica-Bold")
                                .text("Order ID", 50, customerInformationTop + 120)
                                .font("Helvetica")
                                .text(`: ${docs.ORDER_ID}`,150,customerInformationTop + 120)
                                .font("Helvetica-Bold")
                                .text("Bank ID", 50, customerInformationTop + 135)
                                .font("Helvetica")
                                .text(`: ${docs.BANKTXNID}`,150,customerInformationTop + 135)
                                .font("Helvetica-Bold")
                                .text("Bank Name", 50, customerInformationTop + 150)
                                .font("Helvetica")
                                .text(`: ${docs.BANKNAME}`,150,customerInformationTop + 150)
                                .font("Helvetica-Bold")
                                .text("Transaction Date", 50, customerInformationTop + 165)
                                .font("Helvetica")
                                .text(`: ${docs.TXNDATE}`,150,customerInformationTop + 165)
                            
                                .moveDown();
                            
                            }
                            
                            
                            function generateHr(doc, y) {
                              doc
                                .strokeColor("#aaaaaa")
                                .lineWidth(1)
                                .moveTo(50, y)
                                .lineTo(550, y)
                                .stroke();
                            }
                            
                                          
                            createInvoice("./Statement.pdf");

                            const main = async () => {
                              let transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 465,
                                secure: true,
                                auth: {
                                  user: "worlddentistsassociation@gmail.com",
                                  pass: "qbtsyfcbzilnbbwf",
                                  // ⚠️ Use environment variables set on the server for these values when deploying
                                },
                              });

                              let info = await transporter.sendMail({
                                from: '"worlddentistsassociation@gmail.com',
                                to: `${docs.email}`,
                                subject:
                                  "Congratulations! Succesfully Registered to WDC 2023",
                                html: `
                                      <img src="cid:nainarmy432@gmail.com" width="400" />
                                          <h1>Hi ${docs.name},</h1>
                                          <h3>Your Registration is Successfull!</h3>
                                       
                                         <h5>Your password will be the first four letters of your name (capitalized first letter), followed by '@', and the date and month of your birth.<br />
                                         For example, if your name is David Rake and your DOB is 27-08-1997, your password will be Davi@2708. </h5>
                                      
                                          `, // Embedded image links to content ID
                                attachments: [
                                  {
                                    filename: "Statement.pdf",
                                    path: "./Statement.pdf",
                                    cid: "nainarmy412@gmail.com", // Sets content ID
                                  },
                                  {
                                    filename: "WDC-Broucher-Bangkok-2023.pdf",
                                    path: "./WDC-Broucher-Bangkok-2023.pdf",
                                    cid: "nainarmy412@gmail.com", // Sets content ID
                                  },
                                  {
                                    filename: "poster.png",
                                    path: "./poster.png",
                                    cid: "nainarmy432@gmail.com", // Sets content ID
                                  },
                                ],
                              });

                              console.log(info.messageId);
                            };

                            main();
                          }
                        }
                      );
                    };

                    particles(result.ORDERID);
                  }
                }
              );
            }

            response.redirect(`http://localhost:3001/registration`);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
  } else {
    console.log("Checksum Mismatched");
  }
};

module.exports = { addPaymentGateway, paymentResponse };
