import * as projectService from "../services/project.js"

export async function getProject(req, res) {
    const projectId = req.params.id
    
    try {
        const { folderChildMap, nodeMap } = await projectService.getProject(projectId, req.session.user_id);
        res.status(200).json({ message: "project found from database", folderChildMap, nodeMap });
    } catch (error) {
        console.error(error)
        res.status(error.status || 500 ).json({message: error.message || "server error"})
    }
}

export async function getProjects(req, res) {
    const projects = await projectService.getProjects(req.session.user_id)

    res.status(200).json(projects)
}

export async function createProject(req, res) {
    const { projectName } = req.body

    try {
        const { id, name } = await projectService.createProject(projectName, req.session.user_id);
        res.status(201).json({message: "project created succesfully", project: { id, name }})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error})
    }
}

export async function deleteProject(req, res) {
    const { id } = req.params;

    try {
        await projectService.deleteProject(id, req.session.user_id);
        res.status(200).json({ message: "project deleted successfully"});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}

export async function putProject(req, res) {
    const { id } = req.params;
    const { folderChildMap, nodeMap } = req.body;

    try {
        await projectService.putProject(id, folderChildMap, nodeMap);
        res.sendStatus(204);
    } catch (error) { 
        console.error(error)
        res.sendStatus(500);
    } 
}


export async function renameProject(req, res) {
    const { id }  = req.params;
    const { projectName } = req.body;
    
    try {
        await projectService.renameProject(projectName, id, req.session.user_id);
        res.status(200).json({message: "project renamed succesfully"})
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({message: error.message || 'server error'})
    }
}
