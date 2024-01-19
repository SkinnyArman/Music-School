const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    student: {
      type: Object,
      required: true
    },
    branch: {
      type: Object,
      required: true
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
