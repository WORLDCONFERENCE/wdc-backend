const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      unique: "false",
    },
    age: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    Institution: {
      type: String,
      default: "",
    },
    TotalAmounts: {
      type: String,
      default: ""
    },
    gstamount: {
      type: String,
      default: ""
    },
    yearofStudy: {
      type: String,
      default: "",
    },
    streetName: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
      unique: "false",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
    UploadFile: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: Number,
      default: "",
    },

    BasicAmount: {
      type: Number,
      default: "",
    },
    Roles: {
      type: String,
      default: "",
    },
    Designation: {
      type: String,
      default: "",
    },
    Qualification: {
      type: String,
      default: "",
    },
    Speciality: {
      type: String,
      default: "",
    },
    Presentation: {
      type: String,
      default: "",
    },
    Speak: {
      type: String,
      default: "",
    },
    biographyFiles: {
      type: String,
      default: "",
    },
    subjectofPresentation: {
      type: String,
      default: "",
    },
    AccompanyCount: {
      type: String,
      default: null,
    },
    TotalAmount: {
      type: String,
      default: null,
    },
    CVFiles: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "",
    },
    paymentId: {
      type: String,
      default: ""
    },
    order_id: {
      type: String,
      default: ""
    },
    currency: {
      type: String,
      default: ""
    },
    method: {
      type: String,
      default: ""
    },
    vpa: {
      type: String,
      default: ""
    },
    card_id: {
      type: String,
      default: ""
    },
    created_at: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("registerdetail", userSchema);
