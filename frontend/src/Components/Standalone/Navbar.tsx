import { faHome, faHashtag, faBell, faUser, faEllipsis  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Brand from '../../../public/logo.png';
import { useContext, useState, useRef } from "react";
import { AppContext } from "../../App";
import { getLocal, storeLocal, storeTemp } from "../Helpers/funcs";
import { EntryData } from "../../../../types";
import HybridImg from "../Utils/HybridImg";
import { useNavigate } from "react-router-dom";

export default () => {
    const { lightTheme, setNewLogScreen } = useContext(AppContext);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    const { username, displayName, pfp } = getLocal('entryData') as EntryData;

    const { activeNav, changeActiveNav } = useContext(AppContext);

    if (!setNewLogScreen) return;

    function onOver(e:React.MouseEvent<HTMLDivElement, MouseEvent>, veryDark=false) {
        let dark = veryDark ? "#1C2733" : "#283340";
        e.currentTarget.style.background = lightTheme ? "#EBEEF0" : dark;
    }

    function onLeave(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.currentTarget.style.background = "transparent";
    }

    function onNavLinkClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const currentEl = e.currentTarget;
        const currentClass = currentEl.classList.item(0) as string;

        if (currentClass == 'more-window') return;

        if (currentClass == 'rmore') {
            setShowMore(true);
            return;
        } else navigate(currentClass.replace('r', ''));

        if (changeActiveNav) changeActiveNav(currentClass.replace('r', '') as any);
    }

    return <nav className="navbar">
        <div className="routes">
            <main className="branding">
                <img src={Brand} alt="logger-logo" />
            </main>

            <div 
                className={ "rhome " + (activeNav?.home ? 'active-nav' : "") } 
                onClick={onNavLinkClick} 
                onMouseOver={onOver} 
                onMouseLeave={onLeave}
            >
                <FontAwesomeIcon icon={faHome} className="icon" />
                <span>Home</span>
            </div>

            <div 
                className={ "rexplore " + (activeNav?.explore ? 'active-nav' : "") } 
                onClick={onNavLinkClick} 
                onMouseOver={onOver} 
                onMouseLeave={onLeave}
            >
                <FontAwesomeIcon icon={faHashtag} className="icon" />
                <span>Explore</span>
            </div>

            <div 
                className={ "rnoti " + (activeNav?.noti ? 'active-nav' : "") } 
                onClick={onNavLinkClick} 
                onMouseOver={onOver} 
                onMouseLeave={onLeave}
            >
                <FontAwesomeIcon icon={faBell} className="icon" />
                <span>Notifications</span>
            </div>

            <div 
                className={ "rprofile " + (activeNav?.profile ? 'active-nav' : "") } 
                onClick={onNavLinkClick} 
                onMouseOver={onOver} 
                onMouseLeave={onLeave}
            >
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span>Profile</span>
            </div>

            <div 
                className={ "rmore " + (activeNav?.more ? 'active-nav' : "") } 
                id="rmore"
                onClick={onNavLinkClick} 
                onMouseOver={onOver} 
                onMouseLeave={onLeave}
            >
                
                <FontAwesomeIcon icon={faEllipsis} className="icon" />
                <span>More</span>
            </div>
            { 
                showMore 
                    ? <MoreWindow 
                            onLeave={onLeave}
                            onOver={onOver}
                            setShowMore={setShowMore}
                        /> 
                    : "" 
            }

            <button onClick={() => setNewLogScreen(prev => !prev)}>Log</button>
        </div>

        <div className="user-flake" onMouseOver={onOver} onMouseLeave={onLeave}>
            <div className="user-flake-main">
                <HybridImg src={pfp} alt="pfp" className="usr-img" />
                <div className="user-details">
                    <span className="display" title={displayName}>{displayName}</span>
                    <span 
                        className="username"
                        style={{ color: lightTheme ? '#5B7083' : '#8899A6' }}
                        title={username}
                    >@{username}</span>
                </div>
            </div>
            <div className="fmore">
                <FontAwesomeIcon icon={faEllipsis} />
            </div>
        </div>

    </nav>
}

function MoreWindow(props: { 
    onOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, veryDark?: boolean) => void,
    onLeave: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    setShowMore: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { lightTheme, setLightTheme } = useContext(AppContext);
    
    document.addEventListener('click', e => {
        if (!e.target) return;
        const moreWindow = document.getElementById('more-window');
        const moreNav = document.getElementById('rmore');

        if (!moreWindow?.contains(e.target as Node) && !moreNav?.contains(e.target as Node))
            props.setShowMore(false);
    })

    const toggler = useRef<HTMLDivElement>(null);
    
    function toggleTheme() {
        if (!setLightTheme) return;
        if (lightTheme) setLightTheme(false);
        else setLightTheme(true);
    }

    function logout() {
        storeLocal('entryData', '');
        storeTemp('newLogText', '')
        location.reload();
    }

    return <div 
        className="more-window" 
        style={{ 
            backgroundColor: lightTheme ? "white" : "#17202A",
            boxShadow: `0 0 6px 7px ${lightTheme ? "#EBEEF0" : "#283340"}` 
        }}
        id="more-window"
    >
        <div className="theme-switch">
            <div>Theme</div>
            <div className="toggle-button" onClick={toggleTheme}>
                <div className={`toggle-indicator ${lightTheme ? "" : "to-dark"}`}  ref={toggler}></div>
            </div>
        </div>
        <div 
            className="log-out" 
            onMouseOver={e => props.onOver(e, true)} 
            onMouseLeave={props.onLeave}
            onClick={logout}
        >
            Logout
        </div>
    </div>
}