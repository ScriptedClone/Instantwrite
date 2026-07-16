import express from 'express';
import "dotenv/config";
import { generateLLMChat, generateChatsSummary, generateRewrite} from './services/groq.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.post('/api/v1/llm/chat', async (req, res) => {
    const chats = req.body;
    const chat = await generateLLMChat(chats)

    res.json(chat);
})

app.post('/api/v1/llm/summarize', async (req, res) => {
    const chats = req.body;
    const summary = await generateChatsSummary(chats);

    res.json(summary);
})

app.post('/api/v1/llm/rewrite', async (req, res) => {
    const { settings, selection } = req.body;
    const rewrite = await generateRewrite(settings, selection);

    res.json(rewrite);
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})