import { useState } from "react";
import { selectionValues } from "../EditorPanel/editorUtilities";

export default function ContextBox({selection, handleStyle, handleTone, handleGenerateSuggestion}) {
    const textSelected = selectionValues(selection)?.textSelected;
    const [isStyleOpen, setIsStyleOpen] = useState(false)
    const [isToneOpen, setIsToneOpen] = useState(false)

    function handleDropDownToggle(e) {
        let button = e.target.textContent;

        if(button === "style") {
            setIsStyleOpen(!isStyleOpen);
            setIsToneOpen(false);
        }

        if(button === "tone") {
            setIsToneOpen(!isToneOpen);
            setIsStyleOpen(false)
        }
    }
    
    return(
        <div className="contextBox">
            <p>{(textSelected)? textSelected : "highlight a text to rewrite"}</p>

            <div className="dropDownContainer" onClick={handleStyle}>
                <div className="dropDown">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDropDownToggle(e)
                    }}>style</button>

                    {isStyleOpen && 
                    <div className="dropDownContent">
                        <button>Default</button>
                        <button>Descriptive</button>
                        <button>Show not tell</button>
                    </div>}
                </div>     

                <div className="dropDown" 
                     onClick={ (e) => {
                        e.stopPropagation(e) // stop firing handlestyle.
                        handleTone(e)
                }}>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDropDownToggle(e)
                    }}>tone</button>

                    {isToneOpen && 
                    <div className="dropDownContent">
                        <button>Default</button>
                        <button>Romantic</button>
                        <button>Horror</button>   
                        <button>Eerie</button>
                        <button>Mysterious</button>
                    </div>}
                </div>                   
            </div>
            
            <button onClick={handleGenerateSuggestion}>Generate</button>
        </div>
    )
}