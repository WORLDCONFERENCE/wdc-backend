const express = require("express");
const AwardSchema = require("../models/Award");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
  const newAccompany = new AwardSchema(req.body);
  try {
    const savedAccompany = await newAccompany.save();
    // if (savedAccompany) {
    //   const main = async () => {
    //     let transporter = nodemailer.createTransport({
    //       host: "smtp.gmail.com",
    //       port: 465,
    //       secure: true,
    //       auth: {
    //         user: "awardwdc2023@gmail.com",
    //         pass: "eftgnnuhrlcyqqfy",
    //         // ⚠️ Use environment variables set on the server for these values when deploying
    //       },
    //     });


    //     let info = await transporter.sendMail({
    //       from: '"awardwdc2023@gmail.com',
    //       to: `awardwdc2023@gmail.com`,
    //       subject: " WDC 2023 Award Registration Details",
    //       html: `
    //           <p><b>Name</b>: ${newAccompany.name}</p>
    //           <p><b>Email</b>: ${newAccompany.email}</p>
    //           <p><b>Phone Number</b>: ${newAccompany.phoneNumber}</p>
    //           <p><b>Date of Birth</b>: ${newAccompany.age}</p>
    //           <p><b>Gender</b>: ${newAccompany.gender}</p>
    //           <p><b>Institution</b>: ${newAccompany.Institution}</p>
    //           <p><b>Country</b>: ${newAccompany.country}</p>
    //           <p><b>City</b>: ${newAccompany.city}</p>
    //           <p><b>State</b>: ${newAccompany.state}</p>
    //           <p><b>Street Name</b>: ${newAccompany.streetName}</p>
    //           <p><b>Pincode</b>: ${newAccompany.Pincode}</p>
    //           <p><b>Award</b>: ${newAccompany.AwardName}</p>
    //           <p><b>Designation</b>: ${newAccompany.Designation}</p>
    //           <p><b>Qualification</b>: ${newAccompany.Qualification}</p>
    //           <p><b>Biography</b>: ${newAccompany.biography}</p>
    //           <p><b>Speciality</b>: ${newAccompany.Speciality}</p>

    //           `

    //     });

    //     console.log(info.messageId);
    //   };

    //   main();
    // }
    res.status(200).json(savedAccompany);

  } catch (err) {
  }
});

router.get("/", async (req, res) => {
  try {
    const major = await AwardSchema.find();

    res.status(200).json(major);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/award", async (req, res) => {
  try {
    const major = await AwardSchema.find().count();

    res.status(200).json(major);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
