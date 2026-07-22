import { selectionValues } from "../../editor/services/editorUtilities.js";

/**
 * Inserts chat summary on latest user chat object. The summary extends from 
 * the user's latest chat to the previous summary or first index if no user chat object 
 * with a summary property is found. 
 * 
 * @param {*} chats the chat history between user and a model.
 */
export function insertChatsSummary(summary, chats) {
    const index = chats.length - 1;
    chats[index].summary = summary;
}

/**
 * Inserts selected text with surrounding context from editor
 * to user's latest chat.
 * 
 * @param {*} chats the chat history between user and assistant.
 * @param {*} selection the selection object from Tiptap Editor.
 */
export function insertChatContext(chats, selection) {
    if(!selection) return chats;
    const index = chats.length - 1

    chats[index].context = selectionValues(selection);
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
export function getCharCount(chats) {
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
