import { useContext, useRef } from "react";
import { TreeActionsContext } from "./TreeActionsContext.js";

export default function RenameNode({node, handleRenameToggle}) {
    const { onRename } = useContext(TreeActionsContext)

    return (
        <input className="nodeRename"
                onClick={(e) =>  e.stopPropagation()} // Stop onSelectFolder catching input click.
                onKeyDown={(e) => {
                if(e.key === "Enter") {
                    if(e.target.value === '' || e.target.value === null) {
                        handleRenameToggle();
                        return;
                    }
                    const newName = e.target.value;

                    onRename(newName, node.id);
                    handleRenameToggle();
                }
        }}/>
    )
}