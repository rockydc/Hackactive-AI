import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

//setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
const port = 3000;
app.listen(port, () => console.log(`Server ready on http://localhost:${port}`));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) throw new Error("Message must be Array!");
        const contents = conversation.map(({ role, text }) => ({
            role: role,
            parts: [{ text: text }],
        }));
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.9,
                systemInstruction: "Jawab hanya menggunakan bahasa indonesia dan jangan jawabpertanyaan selain tentang coffe shop yang sudah ditentukan di system_prompt.txt",
            },
        });
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }


});