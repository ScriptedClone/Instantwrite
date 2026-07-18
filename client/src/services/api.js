export async function getLLMChat(chats) {
        const res = await fetch('/api/v1/llm/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(chats),
        })

        return await res.json();
}

export async function getChatsSummary(chats) {
    const res = await fetch('/api/v1/llm/summarize', {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(chats),
    })

    return await res.json();
}

export async function getLLMRewrite(settings, selection) {
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

export async function getProject(id) {
    const res = await fetch(`/api/v1/project/${id}`)
    return await res.json();
}