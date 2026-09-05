import deleteIcon from "../../assets/googleDeleteIcon.png"

export default function RewriteBox({rewrites, handleDeleteRewrite}) {
    return (
        <div className="rewriteBox">
            {rewrites && rewrites.map((rewrite, index) => 
                <div className="rewriteExamples" key={index}>
                    <div className="rewriteHeader">
                        <h2>{rewrite?.style} / {rewrite?.tone}</h2>
                        <button className="rewriteDeleteBtn" onClick={() => handleDeleteRewrite(index)}>
                            <img className="rewriteDeleteBtnIcon" src={deleteIcon}/>
                        </button>
                    </div>
                    <span className="rewriteText">{rewrite?.text}</span>
                </div>
            )}

        </div>
    )
}

