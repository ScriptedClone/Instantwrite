import "dotenv/config";
import express from 'express';
import { getProject, putProject} from "./src/services/tree.js";
import { generateLLMChat, generateChatsSummary, generateRewrite} from './src/services/groq.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.get('/api/v1/project/:id', async (req, res) => {
    const { id } = req.params
    const { tree, nodeMap } = await getProject(id);

    res.json({ tree, nodeMap })
})

app.put('/api/v1/project/:id', async (req, res) => {
    const { id } = req.params;
    const { tree, nodeMap } = req.body;

    try {
        await putProject(id, tree, nodeMap);
        res.sendStatus(204);
    } catch (error) { 
        console.error(error)
        res.sendStatus(500);
    } 
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