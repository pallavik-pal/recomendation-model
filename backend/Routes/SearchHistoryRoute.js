// Routes/SearchHistoryRoute.js
const express = require("express");
const SearchHistory = require("../Model/SearchHistory"); // Import the SearchHistory model
const router = express.Router();

// POST route to save search history
router.post("/", async (req, res) => {
  const { user_id, search_query } = req.body;

  // Ensure user_id and search_query are provided
  if (!user_id || !search_query) {
    return res
      .status(400)
      .json({ error: "User ID and search query are required." });
  }

  try {
    // Create a new search history entry
    const newSearchHistory = new SearchHistory({
      user_id,
      search_query,
    });

    // Save the new search history to the database
    await newSearchHistory.save();

    res.status(201).json({ message: "Search history saved successfully." });
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
