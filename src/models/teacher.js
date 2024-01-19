const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
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
    birthdate: {
      type: Date,
      required: true,
    },
    birthplace: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      trim: true,
      required: true,
    },
    numberOfActiveYears: {
      type: Number,
      requiered: true,
    },
    numberOfTeachingYears: {
      type: Number,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Branch model
      ref: "Branch",
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
