import { Router } from 'express';
import { generateLLMChat, generateChatsSummary, generateRewrite } from '../controller/llmController.js';

const route = Router()

route.post('/llm/chat', generateLLMChat);

route.post('/llm/summarize', generateChatsSummary);

route.post('/llm/rewrite', generateRewrite);

export default route;