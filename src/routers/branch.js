const express = require("express");
const Branch = require("../models/branch");

async function getNextBranchNumber() {
  const lastBranch = await Branch.findOne().sort({ branchNumber: -1 });
  return lastBranch ? lastBranch.branchNumber + 1 : 1;
}

async function removeAssociatedData(branchId) {
  // Remove students associated with the branch
  await Student.deleteMany({ branch: branchId });

  // Remove teachers associated with the branch
  await Teacher.deleteMany({ branch: branchId });

  // Remove courses associated with the branch
  // await Course.deleteMany({ branch: branchId });
}

const router = new express.Router();

router.get("/branches", async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

router.post("/branches", async (req, res) => {
  const newBranchNumber = await getNextBranchNumber();
  const branch = new Branch({
    name: req.body.name,
    numberOfStudents: 0,
    numberOfTeachers: 0,
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
    await Branch.findByIdAndRemove(branchId);

    res.status(200).send("Branch and associated data removed.");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

module.exports = router;
