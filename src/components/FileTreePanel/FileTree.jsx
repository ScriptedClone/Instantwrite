import { tree } from "../../storage/fileSystem"

export default function FileTree({ fileTree, handleSelectedDoc, handleSelectedFolder}) {

    function displayFileTree(nodes) {
        const elements = nodes.map((node) => {
            if(node.content !== undefined) {
                return(
                    <li className="folder" 
                        key={node.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelectedFolder(node.id);
                        }}
                    >
                            {node.name}
                            {displayFileTree(node.content)}
                    </li> 
                )
            }

            if(node.type === "text" ) {
                return (
                    <li key={node.id} 
                           className="text"
                           onClick={(e) => {
                                e.stopPropagation();
                                handleSelectedDoc(node.id)
                            }}
                        >
                            {node.name}
                    </li>
                )
            }
        })
        
        return (
            <ul>
                {elements}
            </ul>
        ) 
    }

    return(
        <div className="FileTree" onClick={(e) => {handleSelectedFolder(0)}}>
            {tree && displayFileTree(fileTree.content)}
        </div>
    )
}
