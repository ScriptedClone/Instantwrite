import { tree } from "../../storage/fileSystem"

export default function FileTree({ fileTree, handleSelectedDoc}) {

    function createFileTree(nodes) {
        
        const elements = nodes.map((node) => {
            if(node.content !== undefined) {
                return(
                    <li className="folder" key={node.id}>
                        {node.name}
                        {createFileTree(node.content)}
                    </li> 
                )
            }

            if(node.type === "text" ) {
                return <li key={node.name} 
                           id={node.id} 
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
            <ul className="root">
                {elements}
            </ul>
        ) 
    }

    return(
        <div className="FileTree">
            {tree && createFileTree(fileTree.content)}
        </div>
    )
}
