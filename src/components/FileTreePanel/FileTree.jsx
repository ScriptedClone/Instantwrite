import { tree } from "../../storage/fileSystem"

export default function FileTree({ fileTree, 
                                   handleFileTree}) {
    /**
     * Traverses file tree and build nested lists. 
     * @param {*} nodes is the array of nodes of from parent node.
     * @returns 
     */
    function displayFileTree(nodes) {
        const elements = nodes.map((node) => {
            if(node.content !== undefined) {
                return(
                    <li className="folder" 
                        key={node.id}
                        data-id={node.id}
                    >
                        <button data-id={node.id + "|folderToggleBtn"}>Y</button>
                        {node.name}
                        <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                            X
                        </button>
                        {displayFileTree(node.content)}
                    </li> 
                )
            }

            if(node.type === "text" ) {
                return (
                    <li key={node.id} className="text">
                        <span data-id={node.id}>{node.name}</span>
                        <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                            X
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
