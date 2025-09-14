import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = functions.config().gemini.key;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateText = functions.https.onRequest(async (req, res) => {
  try {
    const prompt: string = req.body.prompt || "Xin chào Gemini!";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    res.json({ text: result.response.text() });
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
