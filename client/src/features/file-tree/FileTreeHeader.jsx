import textIcon from "./assets/textIcon.png"
import folderIcon from "./assets/folderIcon.png"
import saveIcon from "./assets/saveIcon.png"

export default function FileTreeHeader({handleHeaderBtn}) {
    return(
        <div className="fileTreeHeader">
            <button className="fileTreeHeaderBtn" onClick={() => handleHeaderBtn("document")}>
                <img className="fileTreeHeaderIcon" src={textIcon}/>
                <span>Text</span>
            </button>

            <button className="fileTreeHeaderBtn" onClick={() => handleHeaderBtn("folder")}>
                <img className="fileTreeHeaderIcon" src={folderIcon}/>
                <span>Folder</span>
            </button>

            <button className="fileTreeHeaderBtn" onClick={() => handleHeaderBtn("save")}>
                <img className="fileTreeHeaderIcon" src={saveIcon}/>
                <span>Save</span>
            </button>
        </div>
    )
}
