/**
 * Save selected document's id to local storage
 * 
 */
export function storeLastActiveDoc(docNodeId) {
    localStorage.setItem("prevDocId", docNodeId);
}