import "dotenv/config";
import express from 'express';
import path from 'path';
import { sessionConfig } from "./src/config/session.js";
import { sessionValidation } from "./src/middleware/sessionValidation.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js"
import projectRoutes from "./src/routes/projectRoutes.js"
import llmRoutes from "./src/routes/llmRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;
const clientBuildApplication = path.join(import.meta.dirname, '../client/dist');

app.set('trust proxy', 1);
app.use(express.json());
app.use(sessionConfig);
app.use(express.static(clientBuildApplication));

// Endpoints
app.use('/api/v1', authRoutes);
app.use('/api/v1', sessionValidation, projectRoutes);
app.use('/api/v1', sessionValidation, llmRoutes);

// Serve built React SPA
app.use('/*application', (req, res) => {
    res.sendFile(path.join(clientBuildApplication, 'index.html'));
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})
