const express = require("express");
const Student = require("../models/student");
const Branch = require("../models/branch");

const router = new express.Router();

router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().populate(
      "branch",
      "branchNumber name"
    );

    res.send(students);
  } catch (error) {
    res.send(error);
  }
});

router.post("/students", async (req, res) => {
  const student = new Student({ ...req.body, enrolledClassCount: 0 });
  const branch = await Branch.findOne({ branchNumber: req.body.branchNumber });
  if (!branch) {
    res.status(400).send({
      message: "Branch Id does not exist!",
    });
  }

  try {
    const student = new Student({
      ...req.body,
      enrolledClassCount: 0,
      branch: branch._id,
    });
    await student.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
