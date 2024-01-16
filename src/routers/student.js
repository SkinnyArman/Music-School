const express = require("express");
const Student = require("../models/student");
const Branch = require("../models/branch");

const router = new express.Router();

router.get("/students", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to first page
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
  const skip = (page - 1) * pageSize;

  try {
    const students = await Student.find()
      .populate("branch", "branchNumber name")
      .limit(pageSize)
      .skip(skip);

    const totalStudents = await Student.countDocuments(); // Total number of students

    res.send({
      students,
      totalPages: Math.ceil(totalStudents / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error);
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
