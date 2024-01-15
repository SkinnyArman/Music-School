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
  try {
    const branch = await Branch.findOne({
      branchNumber: req.body.branchNumber,
    });
    if (!branch) {
      return res.status(400).send({
        message: "Branch Id does not exist!",
      });
    }

    const student = new Student({
      ...req.body,
      enrolledClassCount: 0,
      branch: branch._id,
    });
    await student.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).send({
        message: "Student not found!",
      });
    }

    res.send({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
