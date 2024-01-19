const express = require("express");
const Student = require("../models/student");
const Branch = require("../models/branch");

const router = new express.Router();

router.get("/students", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  // Extract the 'surname' query parameter
  const surnameQuery = req.query.surname;

  try {
    // Create a query object to filter students
    const query = Student.find();

    // If a 'surname' query parameter is provided, add it to the query
    if (surnameQuery) {
      query.where({ surname: new RegExp(surnameQuery, "i") }); // Case-insensitive search
    }

    // Continue with the rest of the query
    const students = await query
      .populate("branch", "branchNumber name")
      .limit(pageSize)
      .skip(skip);

    const totalStudents = await Student.countDocuments(query); // Consider the query for total count

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
      credit: 0,
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
