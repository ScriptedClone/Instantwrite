export default function FileTreeHeader({handleHeaderBtn}) {
    return(
        <div className="fileTreeHeader">
            <button onClick={() => handleHeaderBtn("document")}>TEXT</button>
            <button onClick={() => handleHeaderBtn("folder")}>FOLDER</button>
        </div>
    )
}
