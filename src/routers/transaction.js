const express = require("express");
const Transaction = require("../models/transaction");
const Student = require("../models/student");
const Branch = require("../models/branch");
const router = express.Router();

// POST route to create a new transaction with branchId, studentId, and amount
router.post("/transactions", async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const student = await Student.findById(studentId);
    const branch = await Branch.findById(student.branch);

    const transaction = new Transaction({
      student: {
        _id: student._id,
        name: student.name,
        surname: student.surname,
      },
      branch: { _id: branch._id, name: branch.name },
      amount,
    });

    await transaction.save();
    await Student.findByIdAndUpdate(studentId, { $inc: { credit: amount } });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create transaction" });
  }
});

router.get("/transactions", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to first page
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
  const skip = (page - 1) * pageSize;

  try {
    const transactions = await Transaction.find()
      .populate("branch")
      .limit(pageSize)
      .skip(skip);

    const totalTransactions = await Transaction.countDocuments(); // Total number of teachers

    res.send({
      transactions,
      totalPages: Math.ceil(totalTransactions / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
