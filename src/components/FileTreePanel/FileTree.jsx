import { useEffect } from "react"

export default function FileTree({ fileTree, handleSelectedDoc}) {
    function traverseFileTree(nodes) {
        const elements = nodes.map((node) => {
            if(node.content !== undefined) {
                return(
                    <li className="folder" key={node.name}>
                        {node.name}
                        {traverseFileTree(node.content)}
                    </li> 
                )
            }

            if(node.type === "text" ) {
                return <li key={node.name} 
                           id={node.name} 
                           className="text"
                           onClick={(e) => {
                                e.stopPropagation();
                                handleSelectedDoc(e)
                           }}
                        >
                            {node.name}
                        </li>
            }
        })
        
        return (
            <ul>
                {elements}
            </ul>
        ) 
    }

    return(
        <div className="FileTree">
            {fileTree && traverseFileTree(fileTree)}
        </div>
    )
}
