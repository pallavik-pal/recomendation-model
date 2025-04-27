// routes/userInteractionRoute.js
const express = require("express");
const UserInteraction = require("../Model/UserInteraction");
const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, product_id, action, ctr } = req.body;
  try {
    const interaction = new UserInteraction({
      user_id,
      product_id,
      action,
      ctr,
    });
    await interaction.save();
    res.status(200).json({ message: "User interaction saved" });
  } catch (error) {
    res.status(500).json({ error: "Error saving user interaction" });
  }
});

module.exports = router;
