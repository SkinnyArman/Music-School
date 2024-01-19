const express = require("express");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

const router = express.Router();

// POST route to create a new transaction with branchId, studentId, and amount
router.post("/transactions", async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const student = Student.findById(studentId)
    console.log(student)

    const transaction = new Transaction({
      payer: studentId,
      branch: student.branch,
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

router.get("/teachers", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to first page
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
  const skip = (page - 1) * pageSize;

  try {
    const transactions = await Transaction.find()
      .populate("branch")
      .populate("payer", "student")
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
