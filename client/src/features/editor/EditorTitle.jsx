import { useEffect, useRef } from "react"

export default function EditorTitle({docName}) {
    return (
        <div className="EditorTitle">
            <h1>{docName}</h1>
        </div>
    )
}