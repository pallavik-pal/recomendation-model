const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const Userroute = require("./Routes/Userroute");
const Productroute = require("./Routes/Productroute");
const SearchHistoryRoute = require("./Routes/SearchHistoryRoute");
const UserInteractionRoute = require("./Routes/UserInteractionRoute");

const { notFound, errorHandler } = require("./middleware/errormiddleware");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "https://recomendation-model-pallavik-pals-projects.vercel.app",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auto Suggest Route
app.post("/api/auto-suggest", async (req, res) => {
  const inputText = req.body.inputText;

  if (!inputText) {
    return res.status(400).json({ error: "Input text is required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: inputText,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    if (response.data && Array.isArray(response.data)) {
      const suggestions = response.data
        .map((item) => item.generated_text)
        .filter(Boolean);

      return res.json({ suggestions });
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);

    if (error.response) {
      return res.status(error.response.status).json({
        error: `Hugging Face API error`,
      });
    } else {
      return res.status(500).json({
        error: `Server error: ${error.message}`,
      });
    }
  }
});

// Routes
app.use("/api/user", Userroute);
app.use("/api/products", Productroute);
app.use("/api/search-history", SearchHistoryRoute);
app.use("/api/user-interactions", UserInteractionRoute);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
