import { useState, useEffect } from "react"
import { getProjects } from "../services/projectAPI";

export default function useProjects(){
    const [projects, setProjects] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadProjects(){
            setError(null);

            try {
                const projects = await getProjects()
                console.log(projects)
                setProjects(projects);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadProjects()
    },[])

    return({
        projectsState: { projects, loading, error },
        actions: {}
    })
}