const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path"); // Import path module

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("template")); // Serve the public folder
const apiKey = "AIzaSyDkvoH9QY32Sqw_yD87kFEqAB2mrpVVaa8"; // Ensure you set this in your .env file
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Serve index.html for root route "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template", "chat.html"));
});

// Chatbot API Route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatSession = model.startChat({
      history: [],
    });

    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
