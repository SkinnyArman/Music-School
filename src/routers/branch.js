const express = require("express");
const Branch = require("../models/branch");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

async function getNextBranchNumber() {
  const lastBranch = await Branch.findOne().sort({ branchNumber: -1 });
  return lastBranch ? lastBranch.branchNumber + 1 : 1;
}

async function removeAssociatedData(branchId) {
  try {
    await Student.deleteMany({ branch: branchId });
    await Teacher.deleteMany({ branch: branchId });
    await Branch.deleteMany({ branch: branchId });
  } catch (error) {
    console.log(error);
  }
}

const router = new express.Router();

router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.send(branches);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/branches", async (req, res) => {
  const newBranchNumber = await getNextBranchNumber();
  const branch = new Branch({
    name: req.body.name,
    numberOfStudents: 0,
    numberOfTeachers: 0,
    numberOfCourses: 0,
    totalPayments: 0,
    branchNumber: newBranchNumber,
  });

  try {
    await branch.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.delete("/branches/:id", async (req, res) => {
  try {
    const branchId = req.params.id;

    // First, remove associated students, teachers, and courses
    await removeAssociatedData(branchId);

    // Then, remove the branch itself
    await Branch.findByIdAndDelete(branchId);

    res.status(200).send("Branch and associated data removed.");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

module.exports = router;
