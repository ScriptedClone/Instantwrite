import { useState } from "react";
import { selectionValues } from "../../util/tiptapEditor.js";
import styleIcon from "./assets/googleStyleIcon.png"
import toneIcon from "./assets/icons8ToneIcon.png"
import generateIcon from "./assets/googleGenerateIcon.png"

export default function ContextBox({selection, style, tone, handleStyle, handleTone, handleGenerateRewrite}) {
    const textSelected = selectionValues(selection)?.textSelected;
    const [isStyleOpen, setIsStyleOpen] = useState(false)
    const [isToneOpen, setIsToneOpen] = useState(false)

    function handleDropDownToggle(button) {
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
            <p className="context">{(textSelected)? textSelected : "highlight a text to rewrite"}</p>

            <div className="dropDownContainer" onClick={handleStyle}>
                <div className="dropDown">
                    <span className="dropDownTitle">style</span>

                    <button className={`dropDownBtn ${(isStyleOpen) ? 'activeDropDown' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDropDownToggle("style")
                    }}>
                        <img className="dropDownIcon" src={styleIcon}/>
                        <span>{style}</span>
                        <span className="dropDownToggle">{">"}</span>
                    </button>

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
                    <span className="dropDownTitle">tone</span>

                    <button className={`dropDownBtn ${(isToneOpen) ? 'activeDropDown' : ''}`}
                            onClick={(e) => {
                        e.stopPropagation();
                        handleDropDownToggle("tone")
                    }}>
                        <img className="dropDownIcon" src={toneIcon}/>
                        <span>{tone}</span>
                        <span className="dropDownToggle">{">"}</span>
                    </button>

                    {isToneOpen && 
                    <div className="dropDownContent">
                        <button>Default</button>
                        <button>Romantic</button>
                        <button>Horror</button>   
                        <button>Eerie</button>
                        <button>Mysterious</button>
                    </div>}
                </div>          

                <button className="dropDownSubmit" onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateRewrite();
                }}>
                    <img className="dropDownIcon" src={generateIcon}/>
                    <span>Generate</span>
                </button>         
            </div>
        </div>
    )
}
