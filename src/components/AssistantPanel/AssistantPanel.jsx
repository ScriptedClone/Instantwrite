import AssistantHeader from "./AssistantHeader"
import TextBox from "./TextBox"
import ChatBox from "./ChatBox"
import ContextBox from "./ContextBox"
import SuggestionBox from "./SuggestionBox"
import{ generateGroqChat, generateSuggestion }from "./groq"
import { use, useEffect, useState } from "react"
import "./AssistantPanel.css"


export default function AssistantPanel({selection}) {
    const [chats, setChats] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [mode, setMode] = useState("CHAT");
    const [style, setStyle] = useState(null);
    const [tone, setTone,] = useState(null);


    useEffect(() => {
        if(chats.length === 0 || chats.at(-1).role !== 'user') return;
        
        async function addGroqChat() {
            const chat = await generateGroqChat([...chats]);
            setChats(c => [...c, {role: "assistant", content: chat}]);
        }

        addGroqChat();
    },[chats])

    function addUserChat(userChat) {
        setChats(c => [...c, {role: "user", content: userChat}])
    }

    function handleSetMode(e) {
        setMode(m => e.target.textContent);
    }

    function handleStyle(e) {
        setStyle(e.target.textContent)
    }

    function handleTone(e) {
        setTone(e.target.textContent)
    }

    function handleDeleteSuggestion(index) {
        setSuggestions(s => s.filter((_, i) => index !== i));
    }

    async function handleGenerateSuggestion() {
        if(!selection) {
            alert("Please highlight a text")
            return;
        };

        const setting = {style: style, tone: tone};
        const response = await generateSuggestion(setting, selection);

        setSuggestions(s => [{style: style, tone: tone, text: response}, ...s])
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