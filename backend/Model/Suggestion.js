const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  term: String, // Search term
  suggestions: [String], // Suggested terms
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
