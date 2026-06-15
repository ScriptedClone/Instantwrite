export default function AssistantHeader({handleSetMode}) {
    function handleClick(e) {
        handleSetMode(e)
        console.log(e.target.textContent);
    }

    return(
        <div className="assistantHeader" onClick={handleClick}>
            <button>REWRITE</button>
            <button>CHAT</button>
        </div>
    )
}