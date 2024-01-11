const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    sex: {
      type: String,
      trim: true,
      enum: ["M", "F"],
    },
    imageURL: {
      type: String,
      trim: true,
      required: false,
    },
    enrolledClassCount: {
      type: Number,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    birthplace: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Branch model
      ref: "Branch",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
