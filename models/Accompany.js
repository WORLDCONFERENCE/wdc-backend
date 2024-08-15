const mongoose = require("mongoose");

const majorSchema = mongoose.Schema(
  {
    inputFields: [
      {
        fullName: {
          type: String,
          required: true,
        },

        emailAddress: {
          type: String,
          required: true,
        },
      },
    ],
    email: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccompanyDetail", majorSchema);
