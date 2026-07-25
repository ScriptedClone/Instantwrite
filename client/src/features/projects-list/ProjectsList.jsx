import { Link } from "react-router"
import useProjects from "./hooks/useProjects"

export default function ProjectList() {

    const { projectsState } = useProjects();
    const { projects, loading, error } = projectsState; 

    return (
        <>
            {!loading &&  projects.map((project) => 

                <Link key={project.id} to={`/editor/${project.id}`}>
                    <div>
                        <p>{project.name}</p>
                    </div>
                </Link>
            )}
        </>
    )
}
