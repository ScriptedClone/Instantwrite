import { useNavigate } from "react-router"
import { deleteProject } from "./services/projectAPI";
import { PROJECT_DELETED } from "../../const/events";
import deleteIcon from "../../assets/deleteIcon.png"
import renameIcon from "../../assets/renameIcon.png"
import './projectList.css'

export default function ProjectsList({projectsState, projectActions, handleIsNaming}) {
    const { projects, loading, error } = projectsState; 
    const { handleDeleteProject } = projectActions;
    const nav = useNavigate();

    return (
        <div className="projectListContainer">
            {!loading &&  projects.map((project) => 
                <div key={project.id} 
                     className="projectCard"
                     onClick={() => nav(`/editor/${project.id}`)}
                >

                    <button className="deleteBtn">
                        <img src={deleteIcon}
                             alt="delete icon"
                             className="deleteIcon"
                             onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project.id)
                            }}
                        />    
                    </button>
                    <button className="renameBtn">
                        <img src={renameIcon}
                             alt="rename icon"
                             className="renameIcon"
                             onClick={(e) => {
                                e.stopPropagation();
                                handleIsNaming(project.id, project.name)
                            }}
                        />    
                    </button>

                    <span>{project.name}</span>
                    
                </div>
            )}
        </div>
    )
}
