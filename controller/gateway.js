
                const particles = async () => {
                    let Id = payment.order_id;

                    let user = UserSchema.findOne({
                        order_id: Id
                    },
                        function (error, docs) {
                            if (error) {
                                console.log(error)
                            }
                            else {
                                console.log(docs.email)
                            }

                            const TransactionDates = new Date(docs.created_at * 1000);


                            function createInvoice(path) {
                                let doc = new PDFDocument({ size: "A5", margin: 50 });

                                generateHeader(doc);
                                generateCustomerInformation(doc);


                                doc.end();
                                doc.pipe(fs.createWriteStream(path));
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
                                    .text(`: ${docs.phoneNumber}`, 150, customerInformationTop + 30)
                                    .font("Helvetica-Bold")
                                    .text("Street Name", 50, customerInformationTop + 45)
                                    .font("Helvetica")
                                    .text(`: ${docs.streetName}`, 150, customerInformationTop + 45)
                                    .font("Helvetica-Bold")
                                    .text("State", 50, customerInformationTop + 60)
                                    .font("Helvetica")
                                    .text(`: ${docs.state}`, 150, customerInformationTop + 60)
                                    .font("Helvetica-Bold")
                                    .text("City", 50, customerInformationTop + 75)
                                    .font("Helvetica")
                                    .text(`: ${docs.city}`, 150, customerInformationTop + 75)
                                    .font("Helvetica-Bold")
                                    .text("Transaction Amount", 50, customerInformationTop + 90)
                                    .font("Helvetica")
                                    .text(`: ${docs.TotalAmount}`, 150, customerInformationTop + 90)
                                    .font("Helvetica-Bold")
                                    .text("Transaction ID", 50, customerInformationTop + 105)
                                    .font("Helvetica")
                                    .text(`: ${docs.paymentId}`, 150, customerInformationTop + 105)
                                    .font("Helvetica-Bold")
                                    .text("Order ID", 50, customerInformationTop + 120)
                                    .font("Helvetica")
                                    .text(`: ${docs.order_id}`, 150, customerInformationTop + 120)
                                    .font("Helvetica-Bold")
                                    .text("Method", 50, customerInformationTop + 135)
                                    .font("Helvetica")
                                    .text(`: ${docs.method}`, 150, customerInformationTop + 135)
                                    .font("Helvetica-Bold")
                                    .text("Currency", 50, customerInformationTop + 150)
                                    .font("Helvetica")
                                    .text(`: ${docs.currency}`, 150, customerInformationTop + 150)
                                    .font("Helvetica-Bold")
                                    .text("Transaction Date", 50, customerInformationTop + 165)
                                    .font("Helvetica")
                                    .text(`: ${TransactionDates.toLocaleDateString()}`, 150, customerInformationTop + 165)
                                    .font("Helvetica-Bold")
                                    .text("Transaction Time", 50, customerInformationTop + 165)
                                    .font("Helvetica")
                                    .text(`: ${TransactionDates.toLocaleTimeString()}`, 150, customerInformationTop + 165)
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
                                    to: `${docs.email},chairman.wdc2023@gmail.com`,
                                    subject:
                                        "Congratulations! Succesfully Registered to WDC 2023",
                                    html: `
                                        <img src="cid:nainarmy432@gmail.com" width="400" />
                                            <h1>Hi ${docs.name},</h1>
                                            <h3>Your Registration is Successfull!</h3>
                                         
                                           <h5>Your password will be the first four letters of your email , followed by '@', and the date and month of your birth.<br />
                                           For example, if your email is davidrake12@gmail.com and your DOB is 27-08-1997, your password will be davi@2708. </h5>
                                        
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
                    )
                }
                particles(payment.order_id);













                     const date = new Date(payment.created_at * 1000);
                console.log(date.toLocaleDateString())
                console.log(date.toLocaleTimeString())

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
                }

                let query = { order_id: payment.order_id };
                console.log(query);

                UserSchema.findOneAndUpdate(
                    query,
                    newValues,
                    { new: true },
                    (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("No Error !")
                        }

                        if (data == null) {
                            console.log("Nothing Found!")
                        }
                        else {
                            console.log("Updated !")
                        }
                    }
                );
