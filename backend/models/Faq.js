const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      get: (v) => v,
      set: (v) => v,
    },
    translations: {
      type: Map,
      of: {
        question: String,
        answer: String,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Faq", faqSchema);
