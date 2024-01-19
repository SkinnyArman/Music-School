const express = require("express");
const Course = require("../models/course");
const Student = require("../models/student");
const Branch = require("../models/branch");
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
  await Branch.findByIdAndUpdate(req.body.branch, {
    $inc: {
      numberOfCourses: 1,
    },
  });

  try {
    // Save the new course
    const savedCourse = await course.save();

    const studentIds = req.body.students; // Array of student IDs
    if (studentIds && studentIds.length > 0) {
      let updates = []; // Initialize an array for asynchronous update operations

      for (let studentId of studentIds) {
        savedCourse.students.push(studentId);

        // Prepare to increment enrolledClassCount and decrement credit for each student
        updates.push(
          Student.findByIdAndUpdate(studentId, {
            $inc: { enrolledClassCount: 1, credit: -savedCourse.tuition },
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
      message: "Course created and student enrollments and credits updated",
      course: savedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/courses", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to first page
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
  const skip = (page - 1) * pageSize;

  try {
    const courses = await Course.find()
      .populate("students")
      .populate("teacher")
      .populate("topic")
      .populate("branch")
      .limit(pageSize)
      .skip(skip);

    const totalCourses = await Course.countDocuments(); // Total number of courses

    res.send({
      courses,
      totalPages: Math.ceil(totalCourses / pageSize),
      currentPage: page,
    });
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
    // Find the course with the list of students
    const course = await Course.findById(req.params.courseId).populate(
      "students"
    );
    if (!course) {
      return res.status(404).send();
    }

    // Update each student's enrolledClassCount
    await Promise.all(
      course.students.map(async (student) => {
        await Student.updateOne(
          { _id: student._id },
          { $inc: { enrolledClassCount: -1 } }
        );
      })
    );

    // Delete the course
    await Course.findByIdAndDelete(req.params.courseId);

    res.send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
