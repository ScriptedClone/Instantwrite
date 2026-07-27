import { useState } from "react"
import ProjectNamePrompt from "../projects-list/ProjectNamePrompt";
import ProjectsList from "../projects-list/ProjectsList"
import useProjects from "../projects-list/hooks/useProjects";
import Header from "../../components/Header"

export default function Home(){
    const [isCreating, setIsCreating] = useState(false);
    const { projectsState, projectActions } = useProjects();

    function handleIsCreating(boolean) {
        setIsCreating(boolean)
    }
    
    return(
        <>
            <Header page={"home"} 
                    handleIsCreating={handleIsCreating}
            />

            <ProjectsList projectsState={projectsState} 
                          projectActions={projectActions}
            />

            {isCreating && 
                <ProjectNamePrompt projectActions={projectActions} 
                                   handleIsCreating={handleIsCreating}
                />
            }
        </>
    )
}