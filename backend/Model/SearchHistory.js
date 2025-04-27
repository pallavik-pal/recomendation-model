const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  search_query: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
