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
    SUGGESTION: (style, tone) => clean(`
        You're a webnovel editor.
        ${suggestionSettings(style, tone)}
        Improve flow, clarity and awkward phrasing.
        Preserve original passage's length and pacing.
        Use context before and context after to understand passage.
        Do not add new events, characters, or details.
        Respond with rewritten passage only.
    `),
    CHAT: clean(`
        You are a professional webnovel assistant.
        Use SURROUNDING CONTEXT BEFORE and SURROUNDING CONTEXT AFTER to understand passage.
        Your job is to assist the user based on USER PROMPT and PASSAGE TO READ.
        If there is no context or passage, assist user based on USER PROMPT.
    `),

    SUMMARIZE: clean(`
        You are a context-continuity summarizer for an AI chatbot. Your output will be inserted at the start
        of a new conversation to give a fresh model instance everything it needs to seamlessly continue an
        ongoing conversation, as if it remembered the prior exchange itself. Precision and completeness
        of relevant details matter more than brevity or readability. You do not add commentary, opinions,
        or evaluate the conversation — you only extract and preserve.

        Preserve, in priority order:
        1. User facts and preferences — anything stated about themselves, goals, constraints, or preferences.
        2. Decisions and commitments — anything agreed upon, chosen, ruled out, or promised.
        3. Task state — what's in progress, done, pending, or blocked.
        4. Open questions / unresolved threads.
        5. Key facts introduced in-conversation that later turns may depend on.
        6. Tone/relationship notes, only if relevant to future assistant behavior.

        Exclude: small talk, dead-end reasoning, redundant back-and-forth, and verbatim long. Do not initate a conversation.
        text (reference drafts/code/documents by state rather than reproducing them, unless short and likely needed again).
        Format: compact, structured, declarative (e.g., labeled sections or bullets) — not narrative prose.
        When uncertain: include rather than omit — the receiving model has no other way to recover missing context.
    `)
}

/**
 * Removes indentations from a string as well as leading and 
 * trailing \n. Used for template literals used as system prompts.
 * 
 * @param {*} str template literal to clean.
 * @returns string with no idnentation.
 */
function clean(str) {
    return str.split('\n')
              .map(line => line.replace(/^[ \t]+/, ''))
              .join('\n')
              .replace(/^\n+/, '') 
              .replace(/\n+$/, ''); 
}

/**
 * 
 * @param {*} style 
 * @param {*} tone 
 * @returns 
 */
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
 * 
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



/**
 * Inserts selected text from editor with surrounding context from the editor 
 * to user's latest chat.
 * 
 * @param {*} chats the chat history between user and assistant.
 * @param {*} selection the selection object from Tiptap Editor.
 * @returns
 */
function insertChatContext(chats, selection) {
    if(!selection) return chats;

    const { textBefore, textSelected, textAfter, contextBefore, contextAfter} = selectionValues(selection)
    const index = chats.length - 1
    const latestChat = chats[index].content;

    return createUserPrompt("--- SURROUNDING CONTEXT BEFORE ---\n"
                            + `${contextBefore}`
                            + `${textBefore}`
                            + " \n--- PASSAGE TO READ ---"
                            + `${textSelected}`
                            + "\n--- SURROUNDING CONTEXT AFTER ---"
                            + `${textAfter}`
                            + `${contextAfter}`
                            + "\n---USER PROMPT ---"
                            + `${latestChat}`)
}

/**
 * Calcualtes total character count across all messages in a conversaton. 
 * 
 * @param {*} chats - the chat history between user and a model.
 * @returns Total character count of all message content combined.
 */
function getCharCount(chats) {
    let conversation = '';
    chats.forEach((chat) => {
        conversation += chat.content
    })
    return conversation.length;
}

/**
 * Summarizes a chat between user and model from specified start to end.
 * 
 * @param {*} chats the chat history between user and a model.
 * @param {*} start specified index to start (inclusive).
 * @param {*} end specified index to end (exclusive).
 */
async function summarizeChats(chats, start, end) {
    const chat = chats.slice(start, end);
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUMMARIZE), ...chat]
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 0.3);

    return res.choices[0]?.message?.content || "Error. Try again";
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
    const res = await fetchModelResponse(prompt, MODELS.llama70b, 0.7)

    return res.choices[0]?.message?.content || "Error. Try again";
}

/**
 * Generate groq response based on chats.
 */
async function generateGroqChat(chats) {
    console.log("chats: ", chats)
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.CHAT), ...chats]
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 1);
    console.log("chats with system", prompt)
    return res.choices[0]?.message?.content || "Error. Try again.";
}

export { generateSuggestion,
         generateGroqChat,
         insertChatContext,
         getCharCount,
         summarizeChats }
         