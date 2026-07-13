import AssistantHeader from "./AssistantHeader"
import TextBox from "./TextBox"
import ChatBox from "./ChatBox"
import ContextBox from "./ContextBox"
import SuggestionBox from "./SuggestionBox"
import{ generateGroqChat, generateSuggestion, insertChatContext, getCharCount, insertChatsSummary }from "./groq"
import { useEffect, useRef, useState } from "react"
import "./AssistantPanel.css"
import { isPositionEqual } from "../EditorPanel/editorUtilities"

const CHAR_LIMIT = 5000;

export default function AssistantPanel({selection}) {
    const selectionPosition = useRef({from: 0, to: 0});
    const selectionChange = useRef(false);
    const [chats, setChats] = useState([]);

    const [suggestions, setSuggestions] = useState([]);
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
        async function addGroqChat() {
            if(chats.length === 0 || chats.at(-1).role !== 'user') return;
            if(selectionChange.current) {
                insertChatContext(chats, selection);
                selectionChange.current = false;
            }
            if(getCharCount(chats) > CHAR_LIMIT) {
                await insertChatsSummary(chats);
            }

            const chat = await generateGroqChat(chats);
            setChats(c => [...c, {role: "assistant", content: chat}]);
        }

        addGroqChat();
                
    },[chats])

    function addUserChat(userChat) {
        setChats(c => [...c, {role: "user", content: userChat}])
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

    function handleDeleteSuggestion(index) {
        setSuggestions(s => s.filter((_, i) => index !== i));
    }

    async function handleGenerateSuggestion() {
        if(!selection) {
            alert("Please highlight a text");
            return;
        };

        const setting = {style: style, tone: tone};
        const suggestion = await generateSuggestion(setting, selection);

        setSuggestions(s => [{style: style, tone: tone, text: suggestion}, ...s])
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
                            handleGenerateSuggestion={handleGenerateSuggestion}/>
                <SuggestionBox suggestions={suggestions} 
                                handleDeleteSuggestion={handleDeleteSuggestion}/>
              </>}
        </div>
    )
}
