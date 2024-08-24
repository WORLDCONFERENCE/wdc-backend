const Razorpay = require('razorpay');
const { v4: uuid } = require('uuid');
const axios = require('axios');
const dotenv = require("dotenv");
const alert = require('alert');
const UserSchema = require('../models/UserSchema');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

dotenv.config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const addPaymentGateway = async (request, response) => {

    const { name, age, gender, Institution, yearofStudy, streetName, city, state, password, email, isAdmin, profilePic, UploadFile, phoneNumber, BasicAmount, Roles, Designation, Qualification, Speciality, Presentation, Speak, biographyFiles, subjectofPresentation, AccompanyCount, TotalAmount, CVFiles, TotalAmounts, gstamount } = request.body;

    const options = {
        amount: gstamount * 100, // amount in the smallest currency unit (e.g., 5000 paise for INR 50)
        currency: "INR",
        receipt: uuid(),
        payment_capture: 1 // 1 for automatic capture, 0 for manual
    };

    try {
        const order = await razorpay.orders.create(options);

        const params = {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
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
            gstamount: gstamount,
            CVFiles: CVFiles,
            TotalAmounts: TotalAmounts,
        };


        response.json(params);

        axios.post("http://localhost:4119/router/register", params, {
            "content-type": "application/json",
        });


    } catch (error) {
        console.log(error);
        response.status(500).send("Error creating order");
    }
};

const paymentResponse = async (request, response) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = request.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);

            if (payment.status === "captured") {
                // Handle successful payment
                const date = new Date(payment.created_at * 1000);

                var newValues = {
                    $set: {
                        status: payment.status,
                        paymentId: payment.id,
                        currency: payment.currency,
                        method: payment.method,
                        vpa: payment.vpa,
                        card_id: payment.card_id,
                        created_at: `${date.toLocaleDateString()},${date.toLocaleTimeString()}`
                    }
                };

                let query = { order_id: payment.order_id };

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
                        }
                    }
                );

                const particles = async () => {
                    let Id = payment.order_id;

                    UserSchema.findOne({ order_id: Id }, function (error, docs) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(docs.email);
                        }

              
                        function createInvoice(path) {
                            let doc = new PDFDocument({ size: "A5", margin: 50 });

                            generateHeader(doc);
                            generateCustomerInformation(doc);

                            doc.end();
                            doc.pipe(fs.createWriteStream(path));
                        }

                        function generateHeader(doc) {
                            doc.image("./logo.png", 50, 85, { width: 50 });
                            doc
                                .fillColor("#444444")
                                .font("Helvetica-Bold")
                                .fontSize(15)
                                .text("World Dental Conference 2024", 110, 57, { align: "center" })
                                .moveDown();
                        }

                        function generateCustomerInformation(doc) {
                            const customerInformationTop = 170;

                            doc
                                .fillColor("#444444")
                                .fontSize(20)
                                .text("Invoice", 50, 130);

                            generateHr(doc, 150);

                            doc
                                .fontSize(10)
                                .font("Helvetica-Bold")
                                .text("Name", 50, customerInformationTop)
                                .font("Helvetica")
                                .text(`: ${docs?.name}`, 150, customerInformationTop)
                                .font("Helvetica-Bold")
                                .text("Email", 50, customerInformationTop + 15)
                                .font("Helvetica")
                                .text(`: ${docs?.email}`, 150, customerInformationTop + 15)
                                .font("Helvetica-Bold")
                                .text("Phone Number", 50, customerInformationTop + 30)
                                .font("Helvetica")
                                .text(`: ${docs?.phoneNumber}`, 150, customerInformationTop + 30)
                                .font("Helvetica-Bold")
                                .text("Street Name", 50, customerInformationTop + 45)
                                .font("Helvetica")
                                .text(`: ${docs?.streetName}`, 150, customerInformationTop + 45)
                                .font("Helvetica-Bold")
                                .text("State", 50, customerInformationTop + 60)
                                .font("Helvetica")
                                .text(`: ${docs?.state}`, 150, customerInformationTop + 60)
                                .font("Helvetica-Bold")
                                .text("City", 50, customerInformationTop + 75)
                                .font("Helvetica")
                                .text(`: ${docs?.city}`, 150, customerInformationTop + 75)
                                .font("Helvetica-Bold")
                                .text("Transaction Amount", 50, customerInformationTop + 90)
                                .font("Helvetica")
                                .text(`: ${docs?.gstamount}`, 150, customerInformationTop + 90)
                                .font("Helvetica-Bold")
                                .text("Order ID", 50, customerInformationTop + 105)
                                .font("Helvetica")
                                .text(`: ${docs?.order_id}`, 150, customerInformationTop + 105)
                                .font("Helvetica-Bold")
                                .text("Currency", 50, customerInformationTop + 120)
                                .font("Helvetica")
                                .text(`: ${docs?.currency}`, 150, customerInformationTop + 120)
                                .font("Helvetica-Bold")
                                .text("Transaction Date", 50, customerInformationTop + 135)
                                .font("Helvetica")
                                .text(`: ${date.toLocaleDateString()}`, 150, customerInformationTop + 135)
                                .font("Helvetica-Bold")
                                .text("Transaction Time", 50, customerInformationTop + 150)
                                .font("Helvetica")
                                .text(`: ${date.toLocaleTimeString()}`, 150, customerInformationTop + 150)
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
                                    pass: "gvbuonasubwwnpsp", // ⚠️ Use environment variables set on the server for these values when deploying
                                },
                            });

                            let info = await transporter.sendMail({
                                from: '"worlddentistsassociation@gmail.com',
                                to: `${docs.email},chairman.wdc2023@gmail.com`,
                                subject: "Congratulations! Successfully Registered to WDC 2024",
                                html: `
                                    <img src="cid:nainarmy432@gmail.com" width="400" />
                                    <h1>Hi ${docs.name},</h1>
                                    <h3>Your Registration is Successful!</h3>
                                   
                                `, // Embedded image links to content ID
                                attachments: [
                                    {
                                        filename: "Statement.pdf",
                                        path: "./Statement.pdf",
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
                    });
                };
                particles(payment.order_id);
                     payment.status === "captured" && alert("Your Registration is Successfully")
                payment.status === "captured" && window.location.replace("http://localhost:3000/#/registration");

            }


         
            response.redirect("https://www.sisahomes.com/");
        } catch (error) {
            console.log(error);
            alert("Your Transaction is Unsuccessful");
            response.status(500).send("Error verifying payment");
        }




    } else {
        console.log("Signature Mismatched");
        response.status(400).send("Invalid Signature");
    }
};

module.exports = { addPaymentGateway, paymentResponse };


