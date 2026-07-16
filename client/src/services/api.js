export async function fetchLLMChat(chats) {+
        console.log("fetch start")
        const res = await fetch('/api/v1/llm/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(chats),
        })

        return await res.json();
}

export async function fetchChatsSummary(chats) {
    const res = await fetch('/api/v1/llm/summarize', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(chats),
    })

    return await res.json();
}

export async function fetchLLMRewrite(settings, selection) {
    const res = await fetch('/api/v1/llm/rewrite', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            settings,
            selection,
        }),
    })

    return await res.json();
}