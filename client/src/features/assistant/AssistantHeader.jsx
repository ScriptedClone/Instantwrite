import chatIcon from "./assets/googleChatIcon.png"
import rewriteIcon from "./assets/googleRewriteIcon.png"


export default function AssistantHeader({handleSetMode, mode}) {
    return(
        <div className="assistantHeader">
            <button className={`assistantHeaderBtn ${(mode === 'Rewrite') ? 'activeBtn' : ''}`}
                    onClick={() => handleSetMode("Rewrite")}
            >
                <img className="assistantHeaderIcon" src={rewriteIcon}/>
                <span>Rewrite</span>
            </button>

            <button className={`assistantHeaderBtn ${(mode === 'Chat') ? 'activeBtn' : ''}`}
                    onClick={() => handleSetMode("Chat")}
            >
                <img className="assistantHeaderIcon" src={chatIcon}/>
                <span>Chat</span>
            </button>
        </div>
    )
}