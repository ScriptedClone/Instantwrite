import { useRef } from "react";

export default function TextBox({addUserChat}) {
    const textareaEl = useRef(null);

    function handleSendClick () {
        addUserChat(textareaEl.current.value);
        textareaEl.current.value = "";
    }

    return(
        <div className="textBoxContainer">
            <textarea className="textBoxInput" ref={textareaEl} placeholder="enter message..."/>
            <button className="textBoxSubmit" onClick={handleSendClick}>submit</button>
        </div>
    );
}