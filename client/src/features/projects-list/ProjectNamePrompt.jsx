import { useState } from "react"
import './projectNamePrompt.css'

export default function ProjectNamePrompt({initialValue = '', onSubmit, onCancel}) {
    const [value, setValue] = useState(initialValue);

    async function handleKeyDown(e) {
        if (e.key === 'Enter') {
            const trimmed = value.trim();

            if (trimmed === '') {
                alert('please fill empty field');
                return;
            }

            await onSubmit(trimmed);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    }
    
    return (
        <div className='projectNameContainer'>
            <span>project name:</span>
            <input
                className="projectNameInput"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        </div>
    )
}
