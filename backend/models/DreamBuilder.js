const mongoose = require("mongoose");

const dreamBuilderSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    lighting: {
      type: String,
      required: true,
      trim: true,
    },
    deskSize: {
      type: String,
      required: true,
      trim: true,
    },
    idea: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DreamBuilder", dreamBuilderSchema);
