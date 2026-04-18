import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // ✅ WORKING MODEL
      messages: [
        {
          role: "user",
          content: `Generate 5 Instagram carousel slides on "${idea}".

Format:
Slide 1:
Title:
Content:

Keep it short and engaging.`,
        },
      ],
    });

    const text = response.choices[0].message.content;

    const slides = text
    .split("Slide")
    .filter((s) => s.trim() !== "")
    .map((slide) => {
        const titleMatch = slide.match(/Title:\s*(.*)/i);
        const contentMatch = slide.match(/Content:\s*(.*)/i);

        return {
        title: titleMatch ? titleMatch[1] : "No Title",
        content: contentMatch ? contentMatch[1] : "No Content",
        };
    });

    res.json({ slides });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate slides" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});