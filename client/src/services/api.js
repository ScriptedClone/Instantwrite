async function request(url, options) {
    const res = await fetch(url, options);

    if(!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || `Request failed: ${res.status}` )
    }

    // If respose has no body.
    if(res.status == 204 || res.headers.get('content-length') === 0) return;
    
    return res.json();
}


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

export async function getProject(id) {
    return await request(`/api/v1/project/${id}`)
}

export async function putProject(id, tree, nodeMap) {
    await request(`/api/v1/project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            tree,
            nodeMap,
        }),
    })
}

export async function postUser(data) {
    return await request('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}

export async function postSession(data) {
    return await request('/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}

export async function deleteSession() {
    return await request('/api/v1/sessions', { 
        method:'DELETE' 
    })
}
