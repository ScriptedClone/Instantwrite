import Groq from 'groq-sdk'
import { selectionValues } from '../EditorPanel/editorUtilities'
const key = import.meta.env.VITE_GROQ_API_KEY

const groq = new Groq({
    apiKey: key,
    dangerouslyAllowBrowser: true
});

const MODELS = { 
    llama8b: "llama-3.1-8b-instant", 
    llama70b: "llama-3.3-70b-versatile"
}

const SYSTEM_PROMPT = {
    SUGGESTION: (style, tone) => clean(`
        You're a webnovel editor.
        ${suggestionSettings(style, tone)}
        Improve flow, clarity and awkward phrasing.
        Preserve original passage's length and pacing.
        Use SURROUNDING CONTEXT BEFORE and SURROUNDING CONTEXT AFTER to understand passage.
        Do not add new events, characters, or details.
        Respond with rewritten passage only.
    `),
    CHAT: clean(`
        You are a professional webnovel assistant.
        Use SURROUNDING CONTEXT BEFORE and SURROUNDING CONTEXT AFTER to understand passage.
        Your job is to assist the user based on USER PROMPT, PASSAGE and CONVERSATION SUMMARY if provided.
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

const CONTEXT_PROMPT = {
    EDITOR_SELECTION: (textBefore, textSelected, textAfter, contextBefore, contextAfter) => clean(`
        --- SURROUNDING CONTEXT BEFORE ---
        ${contextBefore}
        ${textBefore}
        --- PASSAGE ---
        ${textSelected}
        --- SURROUNDING CONTEXT AFTER ---
        ${textAfter}
        ${contextAfter}
    `),
}

/**
 * Removes indentations from a string as well as leading and 
 * trailing \n.
 * 
 * @param {*} str template literal to clean.
 * @returns string.
 */
function clean(str) {
    return str.split('\n')
              .map(line => line.replace(/^[ \t]+/, ''))
              .join('\n')
              .replace(/^\n+/, '') 
              .replace(/\n+$/, ''); 
}

function createSystemPrompt(content) {
    return {role: "system", content: content}
}

function createUserPrompt(content) {
    return {role: "user", content: content}
}
function createAssistantPrompt(content) {
    return {role: "assistant", content: content}
}

/**
 * Send chat completion request to Groq API.
 * 
 * @param {*} messages conversation history.
 * @param {*} model Groq model to be used.
 * @param {*} temperature the temperature setting.
 * @returns response object from groq API.
 */
async function fetchModelResponse(messages, model, temperature) {
    return groq.chat.completions.create({
        messages: messages,
        model: model,
        temperature: temperature,
    })
}

/**
 * Returns a string that contains instruction for rewriting a passage
 * depending on style and tone. 
 * 
 * @returns string 
 */
function suggestionSettings(style, tone) {
        if(style && tone) return `Your task is to edit the given passage with a ${style} style and ${tone} tone.`
        if(style) return `Your task is to edit the given passage with a ${style} style.`
        if(tone) return `Your task is to edit the given passage with a ${tone} tone.`

        // Default setting. 
        return "Your task is to edit the given passage.";
}

/**
 * Generates a suggestion based on user selected text and context from the editor. Context is limited to
 * around 500 Tiptap document positions before and after selected text. 
 * 
 * @param {*} settings an object that contains style and tone properties.
 * @param {*} selection is the selection object from the editor.
 * @returns string from groq chat completion.
 */
async function generateSuggestion(settings, selection) {
    const {style, tone} = settings;
    const { textBefore, textSelected, textAfter, contextBefore, contextAfter} = selectionValues(selection)
    const userPrompt = CONTEXT_PROMPT.EDITOR_SELECTION(textBefore, textSelected, textAfter, contextBefore, contextAfter)

    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUGGESTION(style, tone)), createUserPrompt(userPrompt)];
    const res = await fetchModelResponse(prompt, MODELS.llama70b, 0.7)

    return res.choices[0]?.message?.content || "Error. Try again";
}

/**
 * Calculates total character count starting from the latest user chat object to the previous
 * chat with a summary property.
 * 
 * If there is no user chat object with a summary property, count ends at the oldest chat.
 * 
 * @param {*} chats - the chat history between user and a model.
 * @returns Total character count of all message content, contexts and summary.
 */
function getCharCount(chats) {
    let conversation = '';

    for(let i = chats.length - 1; i >= 0; i--){
        const chat = chats[i];

        conversation += chat.content;
        if(chat.context) conversation +=  chat.context;
        if(chat.summary) {
            conversation += chat.summary
            return conversation.length;
        };
    }

    return conversation.length;
}

/**
 * Inserts chat summary on latest user chat object. The summary extends from 
 * the user's latest chat to the previous summary or first index if no user chat object 
 * with a summary property is found. 
 * 
 * @param {*} chats the chat history between user and a model.
 */
async function insertChatsSummary(chats) {
    const selectedChats = rebuildChat(chats);
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.SUMMARIZE), ...selectedChats];
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 0.3);

    const index = chats.length - 1
    chats[index].summary = res.choices[0]?.message?.content || "Error. Try again.";;
}

/**
 * Inserts selected text with surrounding context from editor
 * to user's latest chat.
 * 
 * @param {*} chats the chat history between user and assistant.
 * @param {*} selection the selection object from Tiptap Editor.
 */
function insertChatContext(chats, selection) {
    if(!selection) return chats;
    const index = chats.length - 1
    const { textBefore, textSelected, textAfter, contextBefore, contextAfter} = selectionValues(selection)

    chats[index].context = CONTEXT_PROMPT.EDITOR_SELECTION(textBefore, textSelected, textAfter, contextBefore, contextAfter);
}

/**
 * Rebuilds chat conversation to have user's content to include context and/or summary. The rebuild stops at 
 * index 0 or where summary of previous conversation is provided.
 * 
 * This is used to seperate chat conversation that the model sees and what is displayed 
 * to the user.
 * 
 * @param {*} chats the chat history between user and a model.
 * @returns a new chat array containing conversation between user and assistant. 
 */
function rebuildChat(chats) {
    let newChats = [];
    let index = chats.length - 1;;

    while(index >= 0) {
        const chat = chats[index];

        if(chat.role === "assistant") newChats.push(chat);
        else {
            const content = chat.content
            let userPrompt = "";

            if(chat.context) {
                userPrompt += chat.context
            }

            if(chat.summary) {
                userPrompt += `\n--- CONVERSATION SUMMARY ---\n${chat.summary}`;
                userPrompt += `\n--- USER PROMPT ---\n${content}`
                newChats.push(createUserPrompt(userPrompt)); 

                return newChats.reverse();
            }

            userPrompt += `\n--- USER PROMPT ---\n${content}`
            newChats.push(createUserPrompt(userPrompt));
        }

        index--;
    }

    return newChats.reverse();
}

/**
 * Generate groq response based on chats.
 * 
 * @param {*} chats the chat history between user and a model.
 * @returns string from groq chat completion.
 */
async function generateGroqChat(chats) {
    console.log("chats from componnent:", chats)
    const newChats = rebuildChat(chats)
    const prompt = [createSystemPrompt(SYSTEM_PROMPT.CHAT), ...newChats]
    const res = await fetchModelResponse(prompt, MODELS.llama8b, 1);
    console.log("prompt to send", prompt)

    return res.choices[0]?.message?.content || "Error. Try again.";
}

export { generateSuggestion,
         generateGroqChat,
         insertChatContext,
         getCharCount,
         insertChatsSummary }
