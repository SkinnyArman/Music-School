const express = require("express");
const Student = require("../models/student");

const router = new express.Router();

router.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

router.post("/students", async (req, res) => {
  const student = new Student({ ...req.body, numberOfEnrolledClasses: 0 });

  try {
    await student.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
