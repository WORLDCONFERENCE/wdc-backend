const express = require("express");
const userSchema = require("../models/UserSchema");

const router = express.Router();

////updated user

router.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

//attender and speaker counts

router.get("/countby", async (req, res, next) => {
  try {
    const SpeakerCount = await userSchema.count({
      Presentation: "Abstract Submission for Speaker",
      // UploadFile: { $ne: null },
    });
    const PaperPersentationCount = await userSchema.count({
      Presentation: "Paper Presentation for Students",
      // UploadFile: { $ne: null },
    });
    const PosterPresentationCount = await userSchema.count({
      Presentation: "Poster Presentation for Students",
      // UploadFile: { $ne: null },
    });

    res.status(200).json([
      { Presentation: "Abstract Submission for Speaker", count: SpeakerCount },
      {
        Presentation: "Paper Presentation for Students",
        count: PaperPersentationCount,
      },
      {
        Presentation: "Poster Presentation for Students",
        count: PosterPresentationCount,
      },
    ]);
  } catch (err) {
    next(err);
  }
});

//attender and speaker counts

router.get("/countUpload", async (req, res, next) => {
  try {
    const SpeakerCount = await userSchema.count({
      Presentation: "Abstract Submission for Speaker",
      UploadFile: { $ne: null },
    });
    const PaperPersentationCount = await userSchema.count({
      Presentation: "Paper Presentation for Students",
      UploadFile: { $ne: null },
    });
    const PosterPresentationCount = await userSchema.count({
      Presentation: "Poster Presentation for Students",
      UploadFile: { $ne: null },
    });

    res.status(200).json([
      { Presentation: "Abstract Submission for Speaker", count: SpeakerCount },
      {
        Presentation: "Paper Presentation for Students",
        count: PaperPersentationCount,
      },
      {
        Presentation: "Poster Presentation for Students",
        count: PosterPresentationCount,
      },
    ]);
  } catch (err) {
    next(err);
  }
});

//txt success

router.get("/countSuccess", async (req, res, next) => {
  try {
    const SpeakerCount = await userSchema.count({
      STATUS: "TXN_SUCCESS",
    });

    res.status(200).json([{ STATUS: "TXN_SUCCESS", count: SpeakerCount }]);
  } catch (err) {
    next(err);
  }
});

//null count

router.get("/counts", async (req, res) => {
  try {
    const CountDocuments = await userSchema
      .find({ UploadFile: { $ne: null } })
      .count();
    res.status(200).json(CountDocuments);
  } catch (err) {
    next(err);
  }
});

//total person register count

router.get("/countRegister", async (req, res) => {
  try {
    const users = await userSchema.find().count();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

//delete user
 
router.delete("/:id", async (req, res, next) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json("user content will be deleted");
  } catch (err) {
    next(err);
  }
});

//get user

router.get("/:id", async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//get all user

router.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

//

module.exports = router;
