import * as llmService from '../services/groqServices.js'

export async function generateLLMChat(req, res) {
    const chats = req.body;
    const chat = await llmService.generateLLMChat(chats)

    res.status(200).json(chat);
}

export async function generateChatsSummary(req, res) {
    const chats = req.body;
    const summary = await llmService.generateChatsSummary(chats);

    res.status(200).json(summary);
}

export async function generateRewrite(req, res) {
    const { settings, selection } = req.body;
    const rewrite = await llmService.generateRewrite(settings, selection);

    res.status(200).json(rewrite);
}