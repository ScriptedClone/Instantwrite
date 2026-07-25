import { request } from "../../../util/request";

export async function getProjects() {
    const result = await request('/api/v1/project');

    return result
}