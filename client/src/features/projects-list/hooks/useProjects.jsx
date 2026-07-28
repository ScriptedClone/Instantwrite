import { useState, useEffect } from "react"
import { createProject, deleteProject, getProjects, renameProject } from "../services/projectAPI";
import { PROJECT_CREATED, PROJECT_DELETED } from "../../../const/events";

export default function useProjects(){
    const [projects, setProjects] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadProjects(){
            setError(null);

            try {
                const projects = await getProjects()
                setProjects(projects);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadProjects()
    },[])


    async function handleCreateProject(projectName) {
        try {
            const result = await createProject(projectName);
            setProjects((p) => [...p, result.project]);
        } catch (error) {
            setError(error);
        }
    }

    async function handleDeleteProject(deletedId) {
        console.log("delete")
        try {
            await deleteProject(deletedId);
            setProjects((p) => p.filter((project) => project.id !== deletedId));
        } catch (error) {
            setError(error);
        }
    }

    async function handleRenameProject(projectName, projectId) {
            try {
                await renameProject(projectName, projectId)
                setProjects((p) => p.map((project) => 
                    project.id === projectId ? { ...project, name: projectName } : project
                ));
            } catch (error) {
                setError(error);
            }
    }
    
    return({
        projectsState: { projects, loading, error },
        projectActions: { 
            handleCreateProject, 
            handleDeleteProject,
            handleRenameProject
        }
    })
}
