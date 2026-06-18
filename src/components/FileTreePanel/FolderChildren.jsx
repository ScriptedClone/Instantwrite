import Folder from "./Folder"

export default function FolderChildren({parentNode}) {
    
    return (
        parentNode.content.map((node) => {
            if(node.type  === "folder") {
                return (
                    <ul key={node.id}><Folder node={node}/></ul>
                )
                
            }

            if(node.type === "text") {
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

    )

}