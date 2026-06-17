export default function FileTreeHeader({handleSetFileTree}) {
    return(
        <div className="fileTreeHeader">
            <button onClick={() => handleSetFileTree("document")}>TEXT</button>
            <button onClick={() => handleSetFileTree("folder")}>FOLDER</button>
        </div>
    )
}
