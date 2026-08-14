import { request } from "../../../util/request.js";

export async function getLLMChat(chats) {
    return await request('/api/v1/llm/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(chats),
    })
}

export async function getChatsSummary(chats) {
    return await request('/api/v1/llm/summarize', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(chats),
    })
}

export async function getLLMRewrite(settings, selection) {
    return await request('/api/v1/llm/rewrite', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            settings,
            selection,
        }),
    })
}
