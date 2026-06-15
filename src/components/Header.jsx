import { syncFileTreeToDisk } from '../storage/fileSystem'
import './Header.css'

export default function Header() {
    return (
        <div id="header">
            <h2>Welcome to Instawrite</h2>
            <button onClick={syncFileTreeToDisk}>SAVE</button>
        </div>
    )
}