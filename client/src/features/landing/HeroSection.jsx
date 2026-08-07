import { useNavigate } from 'react-router'
import homeImage from './assets/heroHomeImage.png'
import editorImage from './assets/heroEditorImage.png'
import './landing.css'

export default function HeroSection(){
    const nav = useNavigate();

    return (
        <div className="heroSectionContainer">
            <div className="heroCTAContainer">
                <div className='heroCTAWrapper'>
                    <span className='heroTitle'>Your Story</span>
                    <span className='heroTitle'>One Workspace</span>
                    <span className='heroSubtitle'>
                        Write instantly with AI-powered assistance and 
                        organize every part of your story in one
                        intuitive workspace
                    </span>
                    <button onClick={() => nav('/login')} className='heroActionBtn'>Start Writing</button>
                </div>
            </div>

            <div className="heroImageContainer">
                <div className="heroImageWrapper">
                    <img className="heroImage" id="heroImage1" src={homeImage} alt='home page example'/>
                    <img className="heroImage" id="heroImage2" src={editorImage} alt='editor page example'/>
                </div>
            </div>
        </div>
    )
}