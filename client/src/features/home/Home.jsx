import { useState, useRef } from "react"
import ProjectNamePrompt from "../projects-list/ProjectNamePrompt";
import ProjectsList from "../projects-list/ProjectsList"
import useProjects from "../projects-list/hooks/useProjects";
import Header from "../../components/Header"
import "./home.css"

export default function Home(){
    const [isCreating, setIsCreating] = useState(false);

    const [isRenaming, setIsRenaming] = useState(false);
    const projectToRename = useRef(null);
    const  projectInitialName = useRef(null);

    const { projectsState, projectActions } = useProjects();
    const { handleCreateProject, handleRenameProject } = projectActions;

    function handleIsCreating(boolean) {
        setIsCreating(boolean)
    }

    function handleIsNaming(projectId, projectName) {
        projectToRename.current = projectId;
        projectInitialName.current = projectName
        setIsRenaming(true)
    }
    
    return(
        <>
            <Header page={"home"} 
                    handleIsCreating={handleIsCreating}
            />

            <ProjectsList projectsState={projectsState} 
                          projectActions={projectActions}
                          handleIsNaming={handleIsNaming}
            />

            {isCreating &&
                <ProjectNamePrompt onSubmit={async (projectName) => {
                                        await handleCreateProject(projectName);
                                        setIsCreating(false);
                                   }}
                                   onCancel={() => handleIsCreating(false)}
                />
            }
            
            {isRenaming &&
                <ProjectNamePrompt initialValue={projectInitialName.current}
                                   onSubmit={async (projectName) => {
                                        await handleRenameProject(projectName, projectToRename.current);
                                        setIsRenaming(false);
                                   }}
                                   onCancel={() => setIsRenaming(false)}
                />
            }
        </>
    )
}
