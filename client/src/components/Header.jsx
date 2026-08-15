import { useNavigate } from 'react-router'
import { deleteSession } from '../features/auth/services/authAPI';
import logoutIconDefault from './assets/googleLogoutDefault.png'
import logoutIconHover from './assets/googleLogoutHover.png'
import './header.css'

export default function Header({page, projectName, handleIsCreating }) {
    const nav = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        try {
            const res = await deleteSession();
            alert(res.message);
            nav("/");
        } catch ( error ) {
            alert(error.message)
        }
    }

    return (
        <>
            {(page === "editor") && 
                <div id="header">
                    <div className="column1">
                        <button className="headerBtn"
                                onClick={() => nav('/home')}
                        >
                            {"<"}
                        </button>
                    </div>

                    <div className="column2">
                        <h2>{projectName}</h2>
                    </div>


                    <div className="column3">

                    </div>
                </div>
            }

            {(page === "home") &&
                <div id="header">
                    <div className="column1">
                        <button className="headerBtn"
                                onClick={() => handleIsCreating(true)}
                        >
                            + project
                        </button>
                    </div>

                    <div className="column2">
                        <h2>Instantwrite</h2>
                    </div>

                    <div className="column3">
                        <button className="headerBtn logoutBtn" 
                                onClick={handleLogout}
                        >   
                            <div className="logoutBtnIconWrap">
                                <img className="logoutBtnIcon logoutBtnDefault" src={logoutIconDefault} alt='logout icon' />
                                <img className="logoutBtnIcon logoutBtnHover" src={logoutIconHover} alt='logout icon' />
                            </div>
                            <span className='logoutBtnText'>logout</span>
                        </button>
                    </div>
                </div>
            }

            {(page === "landing") &&
                <div id="header">
                    <div className="column1">

                    </div>

                    <div className="column2">
                        <h2>Instantwrite</h2>
                    </div>

                    <div className="column3">
    
                    </div>
                </div>
            }
        </>
    )
}
