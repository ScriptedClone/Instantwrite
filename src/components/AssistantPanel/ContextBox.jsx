

export default function ContextBox({editorSelectedTxt, handleContextBox}) {
    return(
        <>
            {editorSelectedTxt &&
                <div className="contextBox" onClick={handleContextBox}>
                    <p>{editorSelectedTxt}</p>
                    <button >Descriptive</button>
                    <button>Romantic</button>
                    <button>Horror</button> 
                    <button>Generate</button> 
                </div>
            }
        </>
    )
}