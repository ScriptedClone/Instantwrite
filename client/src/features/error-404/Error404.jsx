import { useNavigate } from 'react-router'
import './error404.css'

export default function Error404() {
    const nav = useNavigate();

    return(
        <div className='errorMessageContainer'>
            <h1 className='errorMessageTitle'>This page does not exist.</h1>
            <div className='errorMessageBtnWrapper'>
                <button className='errorMessageBtn' onClick={() => nav('/')}>Back to home</button>
            </div>
        </div>
    )
}
