const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
    },
    branchId: {
      type: Number,
      required: true,
      unique: true,
    },
    numberOfStudents: {
      type: Number,
      required: true,
    },
    numberOfTeachers: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
