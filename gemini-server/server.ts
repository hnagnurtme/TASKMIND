import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Validate API key early to fail with clear message
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error(
    "Missing GEMINI_API_KEY environment variable. Please set GEMINI_API_KEY in your .env or environment."
  );
  // Exit with non-zero code so supervising tools notice
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Global handlers for clearer error diagnostics
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection at:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  // optionally exit or keep running depending on your needs
  process.exit(1);
});

app.post("/parse-image", upload.single("image"), async (req, res) => {
  try {
    const r: any = req as any;
    if (!r.file) return res.status(400).json({ error: "No image uploaded" });

    // Convert image buffer to Base64
    const base64Image = r.file.buffer.toString("base64");

    const prompt = `
Bạn là một trợ lý AI. Tôi sẽ gửi cho bạn hình ảnh dưới dạng Base64, chứa lịch thi của sinh viên.
Hãy phân tích hình ảnh và trích xuất danh sách các task thi hoặc deadline, trả về JSON thuần như sau:

[
  {
    "title": "Tên lớp học phần",
    "deadline": "YYYY-MM-DDTHH:MM:SSZ",
    "priority": "high|medium|low",
    "complexity": "high|medium|low",
    "note": "Phòng, giờ, xuất lớp, các ghi chú khác"
  }
]

- Chỉ trả về JSON thuần, không giải thích.
- Nếu không có deadline, để null.
- Base64 image: ${base64Image}
`;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    let tasks: any[] = [];
    const text = result.response.text();

    try {
      // Cố parse JSON từ text
      tasks = JSON.parse(text);
    } catch {
      // Fallback: tìm phần JSON trong text (Regex)
      const match = text.match(/\[.*\]/s);
      if (match) {
        try {
          tasks = JSON.parse(match[0]);
        } catch {
          console.warn("Cannot parse JSON from Gemini, returning stub");
          tasks = [
            {
              title: "Imported task (Gemini parsing failed)",
              deadline: null,
              priority: "medium",
              complexity: "medium",
              note: "Tạm thời",
            },
          ];
        }
      } else {
        console.warn("No JSON found in Gemini output, returning stub");
        tasks = [
          {
            title: "Imported task (Gemini parsing failed)",
            deadline: null,
            priority: "medium",
            complexity: "medium",
            note: "Tạm thời",
          },
        ];
      }
    }

    return res.json({ tasks });
  } catch (err: any) {
    console.error("parse-image error", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
});
app.post("/generate", async (req, res) => {
  try {
    const prompt: string = (req.body.prompt || "Xin chào Gemini!").slice(0, 200);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
