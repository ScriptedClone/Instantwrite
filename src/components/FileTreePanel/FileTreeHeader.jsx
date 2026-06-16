export default function FileTreeHeader({handleSetFileTree}) {
    return(
        <div className="fileTreeHeader">
            <button onClick={handleSetFileTree}>NEW</button>
        </div>
    )
}
