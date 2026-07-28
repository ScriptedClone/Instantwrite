import "dotenv/config";
import express from 'express';
import { sessionValidation } from "./src/middleware/sessionValidation.js";
import { sessionMiddleware } from "./src/config/session.js";
import { createProject, getProject, getProjects, putProject, deleteProject, renameProject } from "./src/services/tree.js";
import { createSession, createUser, validateLogin, validateSignup, authUser } from "./src/services/auth.js";
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
        validateSignup({username, email, password});
        const user_id = await createUser(username, email, password);
        await createSession(user_id, req);

        res.status(201).json({message: 'signup success'});
    } catch (error) {
        res.status(error.status || 500).json({message: error.message || "server error"});
    }
})

app.post('/api/v1/sessions', async (req, res) => {
    const { email, password } = req.body;

    try {
        validateLogin({email, password})
        const user = await authUser(email, password);
        await createSession(user.rows[0].user_id, req);

        res.status(200).json({message: 'login successful'})
    } catch (error) {
        res.status(error.status || 500).json({message: error.message})
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

app.use(sessionValidation)
app.get('/api/v1/project', async (req, res) => {
    const projects = await getProjects(req.session.user_id)

    res.status(200).json(projects)
})

app.get('/api/v1/project/:id', async (req, res) => {
    const { id } = req.params
    const { tree, nodeMap } = await getProject(id);

    res.json({ tree, nodeMap })
})

app.post('/api/v1/project', async (req, res) => {
    const { projectName } = req.body

    try {
        const { id, name } = await createProject(projectName, req.session.user_id);
        res.status(201).json({message: "project created succesfully", project: { id, name }})
    } catch (error) {
        res.status(500).json({message: error})
    }
})

app.delete('/api/v1/project/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteProject(id, req.session.user_id);
        res.status(200).json({ message: "project deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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

app.patch('/api/v1/project/:id', async (req, res) => {
    const { id }  = req.params;
    const { projectName } = req.body;
    
    try {
        await renameProject(projectName, id, req.session.user_id);
        res.status(200).json({message: "project renamed succesfully"})
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({message: error.message || 'server error'})
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
