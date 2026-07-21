import "dotenv/config";
import express from 'express';
import { sessionMiddleware } from "./src/config/session.js";
import { getProject, putProject } from "./src/services/tree.js";
import { createSession, createUser, getUser, matchPassword, validateLogin } from "./src/services/auth.js";
import { generateLLMChat, generateChatsSummary, generateRewrite} from './src/services/groq.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(sessionMiddleware);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.post('/api/v1/users', async (req, res) => {
    const {email, username, password} = req.body

    try {
        await createUser(username, email, password);
        await createSession(username, req);
        res.status(201).json({message: 'signup success'});
    } catch (error) {;
        console.error(error)
        res.status(500).json({message: 'server error, status: 500'});
    }
})

app.post('/api/v1/sessions', async (req, res) => {
    const { email, password } = req.body;
    const result = validateLogin({email, password})
    if(result.error) {
        res.status(400).json(result.error.details[0]);
        return;
    }
    
    const user = await getUser(email, password);
    if(user.rows.length !== 1) {
        res.status(404).json({message: 'user does not exist'});
        return;
    } 

    if(await matchPassword(user, password)) {
        await createSession(user.rows[0].name, req);
        res.status(200).json({message: 'login successful'})
    } else {
        res.status(401).json({message: 'password does not match'})
    }

})

app.delete('/api/v1/sessions', async (req, res) => {
    req.session.destroy((error) =>{
        if(error) {
            res.status(500).json({message: 'log-out failed, please try again'})
            return;
        }
        res.status(200).json({message: 'session deleted'});
    })
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
