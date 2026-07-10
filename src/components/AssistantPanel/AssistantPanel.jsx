import AssistantHeader from "./AssistantHeader"
import TextBox from "./TextBox"
import ChatBox from "./ChatBox"
import ContextBox from "./ContextBox"
import SuggestionBox from "./SuggestionBox"
import{ generateGroqChat, generateSuggestion, insertChatContext, getCharCount, summarizeChats }from "./groq"
import { useEffect, useRef, useState } from "react"
import "./AssistantPanel.css"
import { isPositionEqual } from "../EditorPanel/editorUtilities"

const CHAR_LIMIT = 1500;

export default function AssistantPanel({selection}) {
    const selectionPosition = useRef({from: 0, to: 0});
    const selectionChange = useRef(false);

    const [chats, setChats] = useState([]);
    const groqChats = useRef([]);

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
    })

    useEffect(() => {
        if(getCharCount(groqChats.current) > CHAR_LIMIT) {
            async function summarizeGroqChats() {
                const res = await summarizeChats(groqChats.current, 0, groqChats.current.length - 3);
                const chatSummary = {role: "user", content: res};

                groqChats.current = [chatSummary, ...groqChats.current.slice(groqChats.current.length - 3, groqChats.current.length)];
            }

            summarizeGroqChats() 
        }
    })

    useEffect(() => {
        if(chats.length === 0 || chats.at(-1).role !== 'user') return;
        if(selectionChange.current) {
            const index = groqChats.current.length - 1;
            groqChats.current[index] = insertChatContext(chats, selection)
            selectionChange.current = false;
        }

        async function addGroqChat() {
            const chat = await generateGroqChat(groqChats.current);

            setChats(c => [...c, {role: "assistant", content: chat}]);
            groqChats.current = [...groqChats.current, {role: "assistant", content: chat}];
        }

        addGroqChat();
    },[chats])

    function addUserChat(userChat) {
        setChats(c => [...c, {role: "user", content: userChat}])
        groqChats.current = [...groqChats.current, {role: "user", content: userChat}];
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
