import { request } from "../../../util/request";

export async function getProjects() {
    const result = await request('/api/v1/project');

    return result
}

export async function createProject(projectName) {
    const projectId = await request('/api/v1/project', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({projectName}),
    })

    return projectId;
}

export async function deleteProject(projectId) {
    await request(`/api/v1/project/${projectId}`, {
        method: "DELETE",
    });
}

export async function renameProject(projectName, projectId) {
    await request(`/api/v1/project/${projectId}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({projectName})
    })
}
