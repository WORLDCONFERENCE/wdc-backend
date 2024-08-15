const express = require("express");
const Accompany = require("../models/Accompany");

const router = express.Router();

// router.post("/", async (req, res) => {
//   // const newAccompany = new Accompany(req.body);
//   try {

//     const emails = { email: req.body.email }
//     const update = {
//       $set: {
//         inputFields: {
//           emailAddress: req.body.inputFields.emailAddress,
//           fullName: req.body.inputFields.fullName
//         }
//       }
//     };

//     console.log(update)
//     const options = { upsert: true };
//     const savedUser = await Accompany.updateOne(emails, update, options)

//     // const savedAccompany = await newAccompany.save();

//     res.status(200).json(savedUser);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });


router.post("/", async (req, res) => {
  try {
    const emails = { email: req.body.email };

    const update = {
      $addToSet: {
        inputFields: {
          $each: req.body.inputFields // Assuming inputFields is an array
        }
      }
    };

    console.log(update)

    const options = { upsert: true, new: true };
    const savedUser = await Accompany.updateOne(emails, update, options);

    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const major = await Accompany.find();

    res.status(200).json(major);
  } catch (err) {
    res.status(500).json(err);
  }
});

///Count accompany person

router.get("/email", async (req, res) => {
  try {
    const major = await Accompany.find().count();

    res.status(200).json(major);
  } catch (err) {
    res.status(500).json(err);
  }
});

///Count accompany person

const agg = [
  {
    $group: {
      _id: "NULL",
      totalCount: {
        $sum: {
          $size: "$inputFields",
        },
      },
    },
  },
];

router.get("/emails", async (req, res) => {
  try {
    const major = await Accompany.aggregate(agg);

    res.status(200).json(major);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/wait", async (req, res) => {
  try {
    const major = await Accompany.find({ inputFields: [{ fullName }] }).count();
    res.status(200).json(major);
  } catch (err) { }
});

module.exports = router;
// { inputFields: [{ fullName }] }
