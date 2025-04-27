const mongoose = require("mongoose");

const userInteractionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["click", "impression", "add_to_cart", "purchase"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ctr: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

const UserInteraction = mongoose.model(
  "UserInteraction",
  userInteractionSchema
);

module.exports = UserInteraction;
