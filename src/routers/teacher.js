const express = require("express");
const Teacher = require("../models/teacher");
const Branch = require("../models/branch");
const router = new express.Router();

async function updateTeacherCount(branchNumber, increment = true) {
  const update = increment
    ? { $inc: { numberOfTeachers: 1 } }
    : { $inc: { numberOfTeachers: -1 } };
  await Branch.findOneAndUpdate({ branchNumber: branchNumber }, update);
}

router.get("/teachers", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to first page
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
  const skip = (page - 1) * pageSize;

  try {
    const teachers = await Teacher.find()
      .populate("branch", "name branchNumber")
      .limit(pageSize)
      .skip(skip);

    const totalTeachers = await Teacher.countDocuments(); // Total number of teachers

    res.send({
      teachers,
      totalPages: Math.ceil(totalTeachers / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/teachers", async (req, res) => {
  const teacher = new Teacher(req.body);
  const branch = await Branch.findById(req.body.branch);
  if (!branch) {
    res.status(400).send({
      message: "Branch Id does not exist!",
    });
  }

  try {
    const teacher = new Teacher({
      ...req.body,
      branch: branch._id,
    });

    await teacher.save();
    await updateTeacherCount(teacher.branchNumber);

    res.send(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/teachers/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const teacher = await Teacher.findById(req.params.id);

    updates.forEach((update) => (teacher[update] = req.body[update]));

    await teacher.save();

    if (!teacher) {
      return res.status(404).send();
    }

    res.send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    await updateTeacherCount(teacher.branchNumber, false);
    res.send(teacher);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
