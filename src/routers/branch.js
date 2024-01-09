const express = require("express");
const Branch = require("../models/branch");

async function getNextBranchNumber() {
  const lastBranch = await Branch.findOne().sort({ branchId: -1 });
  return lastBranch ? lastBranch.branchId + 1 : 1;
}

const router = new express.Router();

router.get("/branches", async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});

router.post("/branches", async (req, res) => {
  const branch = new Branch({
    name: req.body.name,
    numberOfStudents: 0,
    numberOfTeachers: 0,
    branchId: await getNextBranchNumber()
  });

  try {
    await branch.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
