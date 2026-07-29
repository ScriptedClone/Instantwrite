import { useState } from "react";
import { useNavigate } from "react-router"
import { deleteProject } from "./services/projectAPI";
import dropDownIcon from "../../assets/dropDownIcon.png"
import deleteIcon from "../../assets/deleteIcon.png"
import renameIcon from "../../assets/renameIcon.png"
import './projectList.css'

export default function ProjectsList({projectsState, projectActions, handleIsNaming}) {
    const { projects, loading, error } = projectsState; 
    const { handleDeleteProject } = projectActions;
    const nav = useNavigate();

    const [dropDownId, setDropDownId] = useState(null);

    /**
     * This is used to toggle dropdown of individual project cards. It works by setting
     * dropDownId to selected card and is set to null if selected again. 
     * 
     * @param {*} projectId the project id of the card where dropdown lives.
     */
    function handleDropDownId(projectId) {
        setDropDownId(p => p === projectId ? null : projectId);
    }

    return (
        <div className="projectListContainer">
            {!loading &&  projects.map((project) => 
                <div key={project.id} 
                     className="projectCard"
                     onClick={() => nav(`/editor/${project.id}`)}
                >
                    
                    <div className="projectDropDownContainer">
                        <div className="projectDropDownWrapper">
                            <img className="projectDropDownIcon" 
                                src={dropDownIcon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDropDownId(project.id);
                                }}
                            />
                            {dropDownId === project.id &&
                                <div className="projectDropDownContent">
                                    <button className="projectDeleteBtn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(project.id)
                                            }}
                                    >
                                        <img src={deleteIcon} alt="delete icon" className="deleteIcon"/>
                                        <span>Delete</span>
                                    </button>

                                    <button className="projectRenameBtn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleIsNaming(project.id, project.name)
                                            }}
                                    >
                                        <img src={renameIcon} alt="rename icon" className="renameIcon"/> 
                                        <span>Rename</span>   
                                    </button>
                                </div>
                            }
                        </div>
                    </div>   

                    <span className="projectName">{project.name}</span>
                    <span className="projectWords">1000 words</span>
                </div>
            )}
        </div>
    )
}
