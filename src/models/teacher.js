const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
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
    expertiseAreas: {
      type: Array,
      required: true,
    },
    teachingBranch: {
      type: Schema.Types.ObjectId,
      required: true
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
