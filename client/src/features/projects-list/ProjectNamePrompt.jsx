import './projectNamePrompt.css'

export default function ProjectNamePrompt({projectActions, handleIsCreating}) {
    const { handleCreateProject } = projectActions

    return(
        <div className='projectNameContainer'>
            <span>project name:</span>
            <input className="projectNameInput" 
                   onKeyDown={async (e)=>{
                   if(e.key === "Enter") {
                        if(e.target.value === '' || e.target.value === null){
                            alert('please fill empty field')
                            
                        } else {
                            const projectName = e.target.value

                            await handleCreateProject(projectName);
                            handleIsCreating(false);
                        }
                   }
            }}/>
        </div>
    )
}