export default function Document({node}) {
    return (
        <li key={node.id} className="text" data-id={node.id}>
            
            {node.name}
            
            <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                X
            </button>
        </li>
    )
}