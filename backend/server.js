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
  origin: "https://frontend-pallavik-pal-pallavik-pals-projects.vercel.app/",  // Replace with your Vercel frontend URL
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));




app.use(express.json());
const apiUrl = process.env.REACT_APP_RENDER_API_URL; 

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
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    // Check if the response is in the expected format
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

    // Send a more descriptive error message
    if (error.response) {
      // If the error is from the Hugging Face API
      return res.status(error.response.status).json({
        error: `Hugging Face API error: ${error.response.data}`,
      });
    } else {
      // Generic server-side error
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
  }
});

// Routes
pp.use('/api/user', Userroute);
app.use('/api/products', Productroute);
app.use('/api/search-history', SearchHistoryRoute);
app.use('/api/user-interactions', UserInteractionRoute);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
// Change the port to 8000
app.listen(8000, () => {
  console.log(`Server running on ${apiUrl}`);
});
