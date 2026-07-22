import { request } from "../../../util/request.js";

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
