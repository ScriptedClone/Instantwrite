import { tree } from "../../storage/fileSystem"

export default function FileTree({ fileTree, 
                                   handleFileTree}) {

    function displayFileTree(nodes) {
        const elements = nodes.map((node) => {
            if(node.content !== undefined) {
                return(
                    <li className="folder" 
                        key={node.id}
                        data-id={node.id}
                    >
                        {node.name}
                        {displayFileTree(node.content)}
                    </li> 
                )
            }

            if(node.type === "text" ) {
                return (
                    <li key={node.id} className="text">
                        <span data-id={node.id}>{node.name}</span>
                        <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                            DELETE
                        </button>
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
        <div className="FileTreeRoot" data-id={"0"} onClick={handleFileTree}>
            {tree && displayFileTree(fileTree.content)}
        </div>
    )
}
