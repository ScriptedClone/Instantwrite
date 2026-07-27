import { useNavigate } from 'react-router'
import { useEffect } from 'react';
import { PROJECT_CREATED } from '../const/events';
import './header.css'
import { createProject } from '../features/projects-list/services/projectAPI';
import { deleteSession } from '../features/auth/services/authAPI';

export default function Header({page, handleIsCreating }) {
    const nav = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        try {
            const res = await deleteSession();
            alert(res.message);
        } catch ( error ) {
            alert(error.message)
        }
    }

    return (
        <>
            {(page === "editor") && 
                <div id="header">
                    <div className="column1">
                        <button onClick={() => nav('/home')}>{"<"}</button>
                    </div>

                    <div className="column2">
                        <h2>Welcome to Instantwrite</h2>
                    </div>


                    <div className="column3">

                    </div>
                </div>
            }

            {(page === "home") &&
                <div id="header">
                    <div className="column1">
                        <button onClick={() => handleIsCreating(true)}>+ new</button>
                    </div>

                    <div className="column2">
                        <h2>Welcome to Instantwrite</h2>
                    </div>

                    <div className="column3">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            }
        </>
    )
}
