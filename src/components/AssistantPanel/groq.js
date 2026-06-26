/** MODEL LIST
 * llama-3.1-8b-instant [workers]
 * lama-3.1-8b-instant [judge]
 */

import Groq from 'groq-sdk'
import { selectionValues } from '../EditorPanel/editorUtilities'
const key = import.meta.env.VITE_GROQ_API_KEY

const groq = new Groq({
    apiKey: key,
    dangerouslyAllowBrowser: true //
});

/**
 * Map for models
 */
const models = {llama8b: "llama-3.1-8b-instant", llama70b: "llama-3.3-70b-versatile"}

/**
 * Create system prompt for Groq API.
 * @param {*} content 
 * @returns 
 */
function createSystemPrompt(content) {
    return {role: "system", content: content}
}

/**
 * Create user message object for Groq API.
 * @param {*} content 
 * @returns 
 */
function createUserPrompt(content) {
    return {role: "user", content: content}
}

/**
 * Send chat completion request to Groq API.
 * @param {*} messages conversation history.
 * @param {*} model Groq model to be used.
 * @returns 
 */
async function fetchModelResponse(messages, model) {
    return groq.chat.completions.create({
        messages: messages,
        model: model,
        temperature: 0.7,
    })
}

/**
 * Returns a suggestion based on user selected text 
 * and context from the editor. Context is limited to
 * around 500 Tiptap document positions before and after
 * selected text. 
 * 
 * @param {*} style 
 * @param {*} userPrompt 
 */
async function generateSuggestion(setting, selection) {

    const {style, tone} = setting;
    const { textBefore, 
            textSelected, 
            textAfter,
            contextBefore, 
            contextAfter} = selectionValues(selection)
    
    // Rewrite settings.
    const systemSetting = (style, tone) => {
        if(style && tone) return `Your task is to edit the given passage with a ${style} style and ${tone} tone.`
        if(style) return `Your task is to edit the given passage with a ${style} style.`
        if(tone) return `Your task is to edit the given passage with a ${tone} tone.`

        // Default setting. 
        return "Your task is to edit the given passage.";
    }

    console.log(style)
    console.log(tone)
    console.log(systemSetting(style, tone));

    const systemPrompt = "You're a webnovel editor."
                       + ` ${systemSetting(style, tone)}`
                       + " Improve flow, clarity and awkward phrasing."
                       + " Preserve original passage's length and pacing."
                       + " Use context before and context after to understand passage."
                       + " Do not add new events, characters, or details."
                       + " Respond with rewritten passage only."
    
    const contextPrompt = "--- CONTEXT BEFORE ---\n"
                  + `${contextBefore}`
                  + `${textBefore}`
                  + " \n--- PASSAGE ---"
                  + `${textSelected}`
                  + "\n--- CONTEXT AFTER ---"
                  + `${textAfter}`
                  + `${contextAfter}`

    const prompt = [createSystemPrompt(systemPrompt), createUserPrompt(contextPrompt)];
    const data = await fetchModelResponse(prompt, models.llama70b)

    return data.choices[0]?.message?.content || "Error. Try again";
}

/**
 * System prompt to start the conversation with chatbot.
 */
const systemChatPrompt = {role: "system", content:"You are a webnovel editing assistant. Ask for"
                                                + "context if not provided."};

/**
 * 
 * @param {} chats convesation history
 * @returns 
 */
async function getGroqChat(chats) {
    return groq.chat.completions.create({
        messages: chats,
        model: models.llama8b,
    });
}

export { systemChatPrompt, 
         getGroqChat,
         generateSuggestion}