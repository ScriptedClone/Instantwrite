import "dotenv/config";
import express from 'express';
import { sessionConfig } from "./src/config/session.js";
import { sessionValidation } from "./src/middleware/sessionValidation.js";
import authRoutes from "./src/routes/authRoutes.js"
import projectRoutes from "./src/routes/projectRoutes.js"
import llmRoutes from "./src/routes/llmRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.use(express.json());
app.use(sessionConfig);
app.use('/api/v1', authRoutes);
app.use('/api/v1', sessionValidation, projectRoutes);
app.use('/api/v1', sessionValidation, llmRoutes);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})
