export default function RewriteBox({rewrites, handleDeleteRewrite}) {
    return (
        <div className="rewriteBox">
            {rewrites && rewrites.map((rewrite, index) => 
                <div key={index} className="exampleRewrites">
                    <h3>style: {rewrite?.style}</h3>
                    <h3>tone: {rewrite?.tone}</h3>
                    <p>{rewrite?.text}</p>
                    <button onClick={() => handleDeleteRewrite(index)}>x</button>
                </div>
            )}

        </div>
    )
}

