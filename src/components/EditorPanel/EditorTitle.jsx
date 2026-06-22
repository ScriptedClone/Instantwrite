import { nodeMap } from "../../storage/fileSystem"

export default function EditorTitle({docName}) {
    return (
        <div className="EditorTitle">
            <h1>{docName}</h1>
        </div>
    )
}