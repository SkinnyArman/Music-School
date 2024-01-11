const express = require("express");
const Course = require("../models/course");

const router = new express.Router();

router.post("/courses", async (req, res) => {
  const course = new Course(req.body);
  try {
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("subcategory")
      .populate("students");
    res.send(courses);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/courses/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId)
      .populate("topic")
      .populate("students");
    if (!course) {
      return res.status(404).send();
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).send();
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/courses/:courseId/enroll", async (req, res) => {
  const courseId = req.params.courseId;
  const studentIds = req.body.studentIds; // Array of student IDs

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    // Iterate over the student IDs and add them to the course
    let alreadyEnrolled = [];
    let enrolled = [];
    for (let studentId of studentIds) {
      if (course.students.includes(studentId)) {
        alreadyEnrolled.push(studentId);
      } else {
        course.students.push(studentId);
        enrolled.push(studentId);
      }
    }

    await course.save();
    res.send({
      message: "Enrollment updated",
      enrolled: enrolled,
      alreadyEnrolled: alreadyEnrolled,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
