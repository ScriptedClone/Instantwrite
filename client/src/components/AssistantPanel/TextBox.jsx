import { useRef } from "react";

export default function TextBox({addUserChat}) {
    const textareaEl = useRef(null);

    function handleSendClick () {
        addUserChat(textareaEl.current.value);
        textareaEl.current.value = "";
    }

    return(
        <div className="textBox">
            <textarea ref={textareaEl} placeholder="enter message..."/>
            <button onClick={handleSendClick}>send</button>
        </div>
    );
}