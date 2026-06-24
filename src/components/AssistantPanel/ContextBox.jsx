import { selectionValues } from "../EditorPanel/editorUtilities";

export default function ContextBox({selection, handleContextBox}) {

    const textSelected = selectionValues(selection)?.textSelected;
    return(
        <>
            {textSelected &&
                <div className="contextBox" onClick={handleContextBox}>
                    <p>{textSelected}</p>
                    <button >Descriptive</button>
                    <button>Romantic</button>
                    <button>Horror</button> 
                    <button>Generate</button> 
                </div>
            }
        </>
    )
}