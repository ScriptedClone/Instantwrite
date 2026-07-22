export async function request(url, options) {
    const res = await fetch(url, options);

    if(!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || `Request failed: ${res.status}` )
    }

    // If respose has no body.
    if(res.status == 204 || res.headers.get('content-length') === 0) return;
    
    return res.json();
}
