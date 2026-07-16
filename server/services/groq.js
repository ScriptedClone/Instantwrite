import Groq from 'groq-sdk'
import { createUserPrompt, createSystemPrompt, rebuildChat } from '../helpers/groqHelpers.js';
import { SYSTEM_PROMPT, CONTEXT_PROMPT } from '../const/prompts.js';
import { MODELS } from '../const/models.js';

const key = process.env.VITE_GROQ_API_KEY
const groq = new Groq({apiKey: key});

/**
 * Send chat completion request to Groq API.
 * 
 * @param {*} messages conversation history.
 * @param {*} model Groq model to be used.
 * @param {*} temperature the temperature setting.
 * @returns response object from groq API.
 */
export async function fetchModelResponse(messages, model, temperature) {
    return groq.chat.completions.create({
        messages: messages,
        model: model,
        temperature: temperature,
    })
}

/**
 * Generates rewritten text based on settings and selection.
 * 
 * @param {*} settings contains style and tone properties used as values to generate rewritten passage.
 * @param {*} selection contains a selected text to be rewritten and surrounding context.
 * @returns groq chat completion content string.
 */
export async function generateRewrite(settings, selection) {
    const { style, tone } = settings;
    const { textBefore, textSelected, textAfter, contextBefore, contextAfter } = selection;
    const userPrompt = CONTEXT_PROMPT.EDITOR_SELECTION(textBefore, textSelected, textAfter, contextBefore, contextAfter)

    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUGGESTION(style, tone)), createUserPrompt(userPrompt)];
    const res = await fetchModelResponse(prompt, MODELS.llama70b, 0.7)

    return res.choices[0]?.message?.content || "Error. Try again";
}

/**
 * Generates a chat summary.
 * 
 * The summary extends from  the user's latest chat to the previous summary 
 * or first index if no user chat object with a summary metadata is found. 
 * 
 * @param {*} chats the chat history between user and a model.
 */
export async function generateChatsSummary(chats) {
    const selectedChats = rebuildChat(chats);
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUMMARIZE), ...selectedChats];
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 0.3);

    return res.choices[0]?.message?.content || "Error. Try again.";
}

/**
 * Generate a chat completion based on chats.
 * 
 * @param {*} chats the chat history between user and a model.
 * @returns groq chat completion content string.
 */
export async function generateLLMChat(chats) {
    const newChats = rebuildChat(chats)
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.CHAT), ...newChats]
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 1);

    return res.choices[0]?.message?.content || "Error. Try again.";
}
