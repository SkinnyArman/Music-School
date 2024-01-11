const express = require("express");
const Category = require("../models/category");

const router = new express.Router();

router.get("/categories", async (req, res) => {
  const categorys = await Category.find().populate('parentCategory', 'name');
  res.send(categorys);
});

router.post("/categories", async (req, res) => {
  const { name, parentCategoryId } = req.body;

  // Check if parentCategoryId is provided and is valid
  if (parentCategoryId) {
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      return res.status(400).send({ message: "Parent category not found" });
    }
  }

  const category = new Category({
    name,
    parentCategory: parentCategoryId || null, // Set to null if no parent
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
