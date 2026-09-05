export default function ChatBox({chats}) {
    return(
        <div className="chatBox">
            {chats && chats.map((chat, index) =>
                <div key={index} className={chat.role}>
                        <p>{chat.content}</p>
                </div>
            )}
        </div>
    )
}