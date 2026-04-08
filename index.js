import 'dotenv/config';
import express from 'express';
import multer from 'multer'
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-3-flash-preview";
app.use(express.json());
const port = 3000;
app.listen(port, () => console.log(`Server ready on http://localhost:${port}`));

//create endpoint /generate-text
app.post('/generate-text', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }


});
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64document = req.file.buffer.toString("base64")

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? "Tolong buat ringkasan dari dokument berikut:", type: "text" },
                { inlineData: { mimeType: req.file.mimetype, data: base64document } }
            ]
        });
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }


});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64audio = req.file.buffer.toString("base64")

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? "Tolong buat transkrip dari rekaman berikut:", type: "text" },
                { inlineData: { mimeType: req.file.mimetype, data: base64audio } }
            ]
        });
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }


});
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const base64image = req.file.buffer.toString("base64")

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: "text" },
                { inlineData: { mimeType: req.file.mimetype, data: base64image } }
            ]
        });
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }


});