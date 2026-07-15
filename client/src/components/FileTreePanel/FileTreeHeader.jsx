export default function FileTreeHeader({handleHeaderBtn}) {
    return(
        <div className="fileTreeHeader">
            <button onClick={() => handleHeaderBtn("document")}>TEXT</button>
            <button onClick={() => handleHeaderBtn("folder")}>FOLDER</button>
            <button onClick={() => handleHeaderBtn("save")}>SAVE</button>
        </div>
    )
}
