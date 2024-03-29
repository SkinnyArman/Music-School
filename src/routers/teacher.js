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
  try {
    const teachers = await Teacher.find()
      .populate("branch", "name branchNumber")
      .populate("major");
    const totalTeachers = await Teacher.countDocuments(); // Total number of teachers

    res.send({
      teachers,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/teachers", async (req, res) => {
  if (Object.keys(req.body) === 0) {
    res.status(400).send({ msg: "Nothing provided!" });
  }
  const teacher = new Teacher(req.body);
  const branch = await Branch.findById(req.body.branch);
  if (!branch) {
    res.status(400).send({
      message: "Branch Id does not exist!",
    });
    return;
  }

  try {
    const teacher = new Teacher({
      ...req.body,
      branch: branch._id,
      imageURL: req.body.imageURL ? req.body.imageURL : ''
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
