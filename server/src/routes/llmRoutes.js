import { Router } from 'express';
import { generateLLMChat, generateChatsSummary, generateRewrite } from '../controller/llmController.js';
import { llmChatLimit, llmRewriteLimit, llmSummaryLimiter } from '../middleware/rateLimiter.js';

const route = Router()

route.post('/llm/chat', llmChatLimit, generateLLMChat);

route.post('/llm/rewrite', llmRewriteLimit, generateRewrite);

route.post('/llm/summarize', llmSummaryLimiter, generateChatsSummary);

export default route;