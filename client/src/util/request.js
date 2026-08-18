import { checkAuth } from "./helpers/checkAuth";
import { redirect } from "./helpers/navigation";

export async function request(url, options) {
    const res = await fetch(url, options);
    const data = await res.json();

    // Return if no respopnse body.
    if(res.status == 204 || res.headers.get('content-length') === 0) return;

    if(!checkAuth(data)) {
        redirect();
        return;
    }

    if(!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`)
    
    return data;
}
