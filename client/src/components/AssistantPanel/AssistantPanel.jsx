import { useEffect, useRef, useState } from "react"
import { fetchLLMChat, fetchChatsSummary, fetchLLMRewrite } from "../../services/api.js"
import { insertChatsSummary, insertChatContext, getCharCount } from "./chatUtilities.js"
import { isPositionEqual, selectionValues } from "../EditorPanel/editorUtilities"
import AssistantHeader from "./AssistantHeader"
import TextBox from "./TextBox"
import ChatBox from "./ChatBox"
import ContextBox from "./ContextBox"
import RewriteBox from "./RewriteBox.jsx"
import "./AssistantPanel.css"


const CHAR_LIMIT = 1500;

export default function AssistantPanel({selection}) {
    const selectionPosition = useRef({from: 0, to: 0});
    const selectionChange = useRef(false);
    const [chats, setChats] = useState([]);

    const [rewrites, setRewrites] = useState([]);
    const [mode, setMode] = useState("CHAT");
    const [style, setStyle] = useState("Default");
    const [tone, setTone,] = useState("Default");
    
    useEffect(() => {
        if(!selection) return;
        if(!isPositionEqual(selectionPosition.current, selection)) {
            selectionPosition.current.from = selection.from;
            selectionPosition.current.to = selection.to;
            selectionChange.current = true;
        }
    },[chats])
    useEffect(() => {
        async function addLLMChat() {
            if(chats.length === 0 || chats.at(-1).role !== 'user') return;
            if(selectionChange.current) {
                insertChatContext(chats, selection);
                selectionChange.current = false;
            }
            if(getCharCount(chats) > CHAR_LIMIT) {
                const summary = await fetchChatsSummary(chats)
                insertChatsSummary(summary, chats);
            }

            const chat = await fetchLLMChat(chats)
            setChats(c => [...c, {role: "assistant", content: chat}]);
        }

        addLLMChat();
    },[chats])
    function addUserChat(userChat) {
        setChats(c => [...c, {role: "user", content: userChat}])
    }

    async function handleGenerateRewrite() {
        if(!selection) {
            alert("Please highlight a text");
            return;
        }; 
        const settings = {style: style, tone: tone};
        const rewrite = await fetchLLMRewrite(settings, selectionValues(selection))

        setRewrites(r => [{style: style, tone: tone, text: rewrite}, ...r])
    }
    function handleDeleteRewrite(index) {
        setRewrites(r => r.filter((_, i) => index !== i));
    }
    function handleSetMode(e) {
        setMode(e.target.textContent);
    }
    function handleStyle(e) {
        setStyle(e.target.textContent);
    }
    function handleTone(e) {
        setTone(e.target.textContent);
    }

    return (
        <div className="assistantPanel">
            <AssistantHeader handleSetMode={handleSetMode}/>
            {(mode === "CHAT") 
            ? <>
                <ChatBox chats={chats}/>
                <TextBox addUserChat={addUserChat}/>
              </> 
            : <>
                <ContextBox selection={selection} 
                            handleStyle={handleStyle}
                            handleTone={handleTone}
                            handleGenerateRewrite={handleGenerateRewrite}/>
                <RewriteBox rewrites={rewrites} 
                            handleDeleteRewrite={handleDeleteRewrite}/>
              </>}
        </div>
    )
}
