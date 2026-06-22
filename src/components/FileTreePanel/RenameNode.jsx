export default function RenameNode({node, handleRenameToggle}) {
    return (
        <input className="nodeRename"
                data-id={node.id + "|renameBtn"}
                onClick={(e) =>  e.stopPropagation()}
                onKeyDown={(e) => {

                if(e.key !== "Enter") {
                    e.stopPropagation();
                }

                if(e.key === "Enter") {
                    handleRenameToggle();
                }
                        
        }}/>
    )
}