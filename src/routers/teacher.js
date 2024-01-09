const express = require("express");
const Teacher = require("../models/teacher");
const router = new express.Router();

router.get("/teachers", async (req, res) => {
  const teachers = await Teacher.find();
  res.send(teachers);
});

router.post("/teachers", async (req, res) => {
  const teacher = new Teacher(req.body);

  try {
    await teacher.save();
    res.send(200);
  } catch (error) {
    console.log(error);
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
    res.send(teacher);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
