import { useRef } from "react";

export default function TextBox({addUserChat}) {
    const textareaEl = useRef(null);

    function resizeTextBox() {
        const el = textareaEl.current;

        el.style.height = "auto"; // reset scrollHeight.
        el.style.height = el.scrollHeight + "px";
    }
        addUserChat(textareaEl.current.value);
        textareaEl.current.value = "";
    }

    return(
        <div className="textBoxContainer">
            <textarea ref={textareaEl} 
                      className="textBoxInput" 
                      placeholder="enter message..." 
                      onInput={resizeTextBox}
            />
        </div>
    );
}