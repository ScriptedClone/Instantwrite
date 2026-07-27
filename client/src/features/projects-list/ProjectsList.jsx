import { Link } from "react-router"
import { deleteProject } from "./services/projectAPI";
import { PROJECT_DELETED } from "../../const/events";
import './projectList.css'

export default function ProjectsList({projectsState, projectActions}) {
    const { projects, loading, error } = projectsState; 
    const { handleDeleteProject } = projectActions;

    return (
        <div className="projectListContainer">
            {!loading &&  projects.map((project) => 
                <div key={project.id} className="projectCard">
                    <button onClick={() => handleDeleteProject(project.id)}>X</button>
                    
                    <span>
                        <Link to={`/editor/${project.id}`}>{project.name}</Link>
                    </span>

                    
                </div>
            )}
        </div>
    )
}
