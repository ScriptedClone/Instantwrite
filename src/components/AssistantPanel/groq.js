import Groq from 'groq-sdk'
import { selectionValues } from '../EditorPanel/editorUtilities'
const key = import.meta.env.VITE_GROQ_API_KEY

const groq = new Groq({
    apiKey: key,
    dangerouslyAllowBrowser: true
});

/**
 * Map for models
 */
const MODELS = { llama8b: "llama-3.1-8b-instant", 
                 llama70b: "llama-3.3-70b-versatile"}

const SYSTEM_PROMPT = {
    SUGGESTION: (style, tone) => 
                "You're a webnovel editor."
                + ` ${suggestionSettings(style, tone)}`
                + " Improve flow, clarity and awkward phrasing."
                + " Preserve original passage's length and pacing."
                + " Use context before and context after to understand passage."
                + " Do not add new events, characters, or details."
                + " Respond with rewritten passage only.",

    CHAT: "You are a professional webnovel assistant."
          + " Use SURROUNDING CONTEXT BEFORE and SURROUNDING CONTEXT AFTER to understand passage."
          + " Your job is to assist the user based on USER PROMPT and PASSAGE TO READ"
          + " If there is no context or passage, assist user based on USER PROMPT."
}

function suggestionSettings(style, tone) {
        if(style && tone) return `Your task is to edit the given passage with a ${style} style and ${tone} tone.`
        if(style) return `Your task is to edit the given passage with a ${style} style.`
        if(tone) return `Your task is to edit the given passage with a ${tone} tone.`

        // Default setting. 
        return "Your task is to edit the given passage.";
}

function createSystemPrompt(content) {
    return {role: "system", content: content}
}

function createUserPrompt(content) {
    return {role: "user", content: content}
}

/**
 * Send chat completion request to Groq API.
 * @param {*} messages conversation history.
 * @param {*} model Groq model to be used.
 * @param {*} temperature the temperature setting.
 * @returns 
 */
async function fetchModelResponse(messages, model, temperature) {
    return groq.chat.completions.create({
        messages: messages,
        model: model,
        temperature: temperature,
    })
}

function buildChatContext(chats, selection) {
    if(!selection) return chats;
    const { textBefore, textSelected, textAfter, contextBefore, contextAfter} = selectionValues(selection)
    const newChats = chats.slice();
    const firstChat = chats[0].content;

    newChats[0] = createUserPrompt("--- SURROUNDING CONTEXT BEFORE ---\n"
                                   + `${contextBefore}`
                                   + `${textBefore}`
                                   + " \n--- PASSAGE TO READ ---"
                                   + `${textSelected}`
                                   + "\n--- SURROUNDING CONTEXT AFTER ---"
                                   + `${textAfter}`
                                   + `${contextAfter}`
                                   + "\n---USER PROMPT ---"
                                   + `${firstChat}`)
    
    return newChats;
}

/**
 * Returns a suggestion based on user selected text 
 * and context from the editor. Context is limited to
 * around 500 Tiptap document positions before and after
 * selected text. 
 * 
 * @param {*} setting 
 * @param {*} selection
 */
async function generateSuggestion(setting, selection) {
    const {style, tone} = setting;
    const { textBefore, 
            textSelected, 
            textAfter,
            contextBefore, 
            contextAfter} = selectionValues(selection)

    const userPrompt = "--- CONTEXT BEFORE ---\n"
                     + `${contextBefore}`
                     + `${textBefore}`
                     + " \n--- PASSAGE ---"
                     + `${textSelected}`
                     + "\n--- CONTEXT AFTER ---"
                     + `${textAfter}`
                     + `${contextAfter}`

    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUGGESTION(style, tone)), createUserPrompt(userPrompt)];
    const data = await fetchModelResponse(prompt, MODELS.llama70b, 0.7)

    return data.choices[0]?.message?.content || "Error. Try again";
}

/**
 * Generate groq response based on chats.
 */
async function generateGroqChat(chats) {
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.CHAT), ...chats]
    const data = await fetchModelResponse(prompt, MODELS.llama8b, 1);
    console.log(prompt);
    return data.choices[0]?.message?.content || "Error. Try again.";
}

export { generateSuggestion,
         generateGroqChat,
         buildChatContext }