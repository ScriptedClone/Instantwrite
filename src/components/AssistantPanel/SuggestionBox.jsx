export default function SuggestionBox({suggestions, handleDeleteSuggestion}) {
    return (
        <div className="suggestionBox">
            {suggestions && suggestions.map((suggestion, index) => 
                <div key={index} className="exampleSuggestions">
                    <h2>{suggestion?.style}</h2>
                    <p>{suggestion?.text}</p>
                    <button onClick={() => handleDeleteSuggestion(index)}>DELETE</button>
                </div>
            )}

        </div>
    )
}

