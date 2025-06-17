const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Create transaction and update stock
router.post('/', protect, async (req, res) => {
  const { product, quantity } = req.body;
  const foundProduct = await Product.findById(product);
  if (!foundProduct || foundProduct.stock < quantity)
    return res.status(400).json({ message: 'Insufficient stock or product not found' });

  foundProduct.stock -= quantity;
  await foundProduct.save();

  const total = quantity * foundProduct.price;
  const transaction = await Transaction.create({ product, quantity, total });
  res.status(201).json(transaction);
});

// Get all transactions
router.get('/', protect, async (req, res) => {
  const transactions = await Transaction.find().populate('product');
  res.json(transactions);
});

module.exports = router;