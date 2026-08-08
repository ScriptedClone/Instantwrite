import { request } from "../../../util/request.js";

export async function getProject(id) {
    return await request(`/api/v1/project/${id}`)
}

export async function putProject(id, folderChildMap, nodeMap) {
    await request(`/api/v1/project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            folderChildMap,
            nodeMap,
        }),
    })
}
