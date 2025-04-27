// routes/ProductRoute.js
const express = require("express");
const Product = require("../Model/Product"); // Assuming Product model is created
const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from DB
    res.json(products); // Send products as response
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new product
router.post("/", async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    const newProduct = new Product({ name, description, price, image });
    await newProduct.save(); // Save the new product to DB
    res.status(201).json(newProduct); // Respond with the created product
  } catch (error) {
    res.status(400).json({ message: "Failed to add product" });
  }
});

module.exports = router;
