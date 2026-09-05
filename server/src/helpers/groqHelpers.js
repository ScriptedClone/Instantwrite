import { CONTEXT_PROMPT } from '../const/prompts.js'

/** Creates a system prompt object */
export function createSystemPrompt(content) {
    return {role: "system", content: content}
}

/** Creates a user prompt object */
export function createUserPrompt(content) {
    return {role: "user", content: content}
}

/**
 * Rebuilds chat conversation to have user content property to include metadata. The rebuild stops at 
 * index 0 or where the latest summary metadata is defined. 
 * 
 * This is used to strip metadata out of the user chat object before being sent to groq api. 
 * 
 * @param {*} chats the chat history between user and a model.
 * @returns a new chat array without metadata. 
 */
export function rebuildChat(chats) {
    let newChats = [];
    let index = chats.length - 1;;

    while(index >= 0) {
        const chat = chats[index];

        if(chat.role === "assistant") newChats.push(chat);
        else {
            const content = chat.content
            let userPrompt = "";

            if(chat.context) {
                const { textBefore, textSelected, textAfter, contextBefore, contextAfter } = chat.context
                userPrompt += CONTEXT_PROMPT.EDITOR_SELECTION(textBefore, textSelected, textAfter, contextBefore, contextAfter);
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
