/**
 * Used on request.js as a condition for redirecting users 
 * when their session expires.
 * 
 * @param {*} data response converted to JSON from backend.
 * @returns bool
 */
export function checkAuth(data) {
    if(data.session === false) return false;
    return true;
}
