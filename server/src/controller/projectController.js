import * as projectService from "../services/projectServices.js"

export async function getProject(req, res) {
    const projectId = req.params.id
    const { folderChildMap, nodeMap } = await projectService.getProject(projectId, req.session.user_id);

    res.status(200).json({ message: "project found from database", folderChildMap, nodeMap });
}

export async function getProjects(req, res) {
    const projects = await projectService.getProjects(req.session.user_id)

    res.status(200).json(projects)
}

export async function createProject(req, res) {
    const { projectName } = req.body
    const { id, name } = await projectService.createProject(projectName, req.session.user_id);

    res.status(201).json({message: "project created succesfully", project: { id, name }})
}

export async function deleteProject(req, res) {
    const projectId = req.params.id;
    await projectService.deleteProject(projectId, req.session.user_id);

    res.status(200).json({ message: "project deleted successfully"});
}

export async function putProject(req, res) {
    const projectId = req.params.id;
    const { folderChildMap, nodeMap } = req.body;
    await projectService.putProject(projectId, req.session.user_id, folderChildMap, nodeMap);
    
    res.status(200).json({message: "project saved succesfully"});
}


export async function renameProject(req, res) {
    const { id }  = req.params;
    const { projectName } = req.body;
    await projectService.renameProject(projectName, id, req.session.user_id);

    res.status(200).json({message: "project renamed succesfully"})
}
