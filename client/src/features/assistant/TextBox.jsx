import { useRef, useEffect } from "react";
import chatSendIcon from "./assets/googleChatSendIcon.png" 

export default function TextBox({addUserChat}) {
    const textareaEl = useRef(null);

    useEffect(() => {
        textareaEl.current?.focus();
    }, []);

    function resizeTextBox() {
        const el = textareaEl.current;

        el.style.height = "auto"; // reset scrollHeight.
        el.style.height = el.scrollHeight + "px";
    }

    function sendMessage() {
        if(textareaEl.current.value === "") {
            alert('please enter a text');
            return;
        };

        addUserChat(textareaEl.current.value);
        textareaEl.current.value = "";
        resizeTextBox() // reset textbox after clear
    }

    function handleTextBoxSend () {
        sendMessage()
    }

    function handleOnEnter (e) {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage()
        }
    }

    return(
        <div className="textBoxContainer">
            <textarea ref={textareaEl} 
                      className="textBoxInput" 
                      placeholder="enter message..." 
                      onKeyDown={handleOnEnter}
                      onInput={resizeTextBox}
            />
            
            <button className="textBoxSendBtn">
                <img src={chatSendIcon}
                    className="textBoxSendIcon" 
                    onClick={handleTextBoxSend}
                />
            </button>

        </div>
    );
}
