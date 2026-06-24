import AssistantHeader from "./AssistantHeader"
import TextBox from "./TextBox"
import ChatBox from "./ChatBox"
import ContextBox from "./ContextBox"
import SuggestionBox from "./SuggestionBox"
import{ systemChatPrompt, getGroqChat, generateSuggestion}from "./groq"
import { use, useEffect, useState } from "react"
import "./AssistantPanel.css"


export default function AssistantPanel({selection}) {
    const [chats, setChats] = useState([]);
    const [mode, setMode] = useState("CHAT");
    const [writeStyle, setWriteStyle] = useState("Descriptive");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if(chats.length === 0 || chats.at(-1).role !== 'user') return;
        
        async function addGroqChat() {
            
            const data = await getGroqChat([systemChatPrompt, ...chats]);
            setChats(c => [...c, {role: "assistant", 
                                  content: data.choices[0]?.message?.content 
                                  || "Error. Please try again"}]);
        }

        addGroqChat();
    },[chats])

    function addUserChat(userChat) {
        setChats(c => [...c, {role: "user", content: userChat}])
    }

    function handleSetMode(e) {
        setMode(m => e.target.textContent);
    }

    function handleDeleteSuggestion(index) {
        setSuggestions(s => s.filter((_, i) => index !== i));
        console.log("Deleted a suggestion!");
    }

    async function handleContextBox(e) {

        if(e.target.textContent === "Generate") {
            const response = await generateSuggestion(writeStyle, selection)

            setSuggestions(s => [{style: writeStyle, text: response}, ...s])

            return;
        }

        setWriteStyle(w => e.target.textContent);
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
                <ContextBox selection={selection} handleContextBox={handleContextBox}/>
                <SuggestionBox suggestions={suggestions} handleDeleteSuggestion={handleDeleteSuggestion}/>
              </>}
        </div>
    )
}