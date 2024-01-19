const express = require("express");
const Course = require("../models/course");
const Student = require("../models/student");
const router = new express.Router();

// router.post("/courses", async (req, res) => {
//   const course = new Course(req.body);
//   try {
//     await course.save();
//     res.status(201).send(course);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
router.post("/new-course", async (req, res) => {
  // Create a new course instance
  const course = new Course(req.body);

  try {
    // Save the new course
    const savedCourse = await course.save();

    const studentIds = req.body.students; // Array of student IDs
    if (studentIds && studentIds.length > 0) {
      let enrolled = [];
      let updates = []; // Initialize an array for asynchronous update operations

      for (let studentId of studentIds) {
        savedCourse.students.push(studentId);
        enrolled.push(studentId);

        // Prepare to increment enrolledClassCount for each student
        updates.push(
          Student.findByIdAndUpdate(studentId, {
            $inc: { enrolledClassCount: 1 },
          })
        );
      }

      // Perform all update operations
      await Promise.all(updates);

      // Save updates to the course
      await savedCourse.save();
    }

    // Send the response
    res.send({
      message: "Course created and enrollment updated",
      course: savedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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

module.exports = router;
