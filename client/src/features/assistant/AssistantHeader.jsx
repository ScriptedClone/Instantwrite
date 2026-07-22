export default function AssistantHeader({handleSetMode}) {
    function handleClick(e) {
        handleSetMode(e)
    }

    return(
        <div className="assistantHeader" onClick={handleClick}>
            <button>REWRITE</button>
            <button>CHAT</button>
        </div>
    )
}