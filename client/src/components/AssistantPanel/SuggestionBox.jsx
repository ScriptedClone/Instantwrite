export default function SuggestionBox({suggestions, handleDeleteSuggestion}) {
    return (
        <div className="suggestionBox">
            {suggestions && suggestions.map((suggestion, index) => 
                <div key={index} className="exampleSuggestions">
                    <h3>style: {suggestion?.style}</h3>
                    <h3>tone: {suggestion?.tone}</h3>
                    <p>{suggestion?.text}</p>
                    <button onClick={() => handleDeleteSuggestion(index)}>x</button>
                </div>
            )}

        </div>
    )
}

