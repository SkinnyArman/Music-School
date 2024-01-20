const express = require("express");
const Student = require("../models/student");
const Branch = require("../models/branch");
const Course = require("../models/course");
const router = new express.Router();

router.get("/students", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  // Extract the 'surname' and 'branchId' query parameters
  const surnameQuery = req.query.surname;
  const branchIdQuery = req.query.branchId;

  try {
    // Create a query object to filter students
    const query = Student.find();

    // If a 'surname' query parameter is provided, add it to the query
    if (surnameQuery) {
      query.where({ surname: new RegExp(surnameQuery, "i") }); // Case-insensitive search
    }

    // If a 'branchId' query parameter is provided, add it to the query
    if (branchIdQuery) {
      query.where({ branch: branchIdQuery }); // Filter by branch ID
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
    const branch = await Branch.findById(req.body.branch);
    if (!branch) {
      return res.status(400).send({
        message: "Branch Id does not exist!",
      });
    }
    await Branch.findByIdAndUpdate(req.body.branch, {
      $inc: {
        numberOfStudents: 1,
      },
    });

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
  const studentId = req.params.id;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({
        message: "Student not found!",
      });
    }

    await Student.findByIdAndDelete(studentId);

    // Remove the student from the Branch
    await Branch.findByIdAndUpdate(student.branch, {
      $inc: {
        numberOfStudents: -1,
      },
    });

    // Remove the student from any courses they are enrolled in
    await Course.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    // Delete the student

    res.send({ message: "Student deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


module.exports = router;
