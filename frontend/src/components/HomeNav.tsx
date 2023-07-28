import { faHome, faHashtag, faBell, faUser, faEllipsis  } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Brand from '../../public/vite.svg';
import { useContext, useState, useRef } from "react";
import { ThemeContext } from "../App";

export default () => {
    const { lightTheme } = useContext(ThemeContext);
    const [showMore, setShowMore] = useState(false);

    function onOver(e:React.MouseEvent<HTMLDivElement, MouseEvent>, veryDark=false) {
        let dark = veryDark ? "#1C2733" : "#283340";
        e.currentTarget.style.background = lightTheme ? "#EBEEF0" : dark;
    }

    function onLeave(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.currentTarget.style.background = "transparent";
    }

    function onNavLinkClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) 
    {
        const siblingCount = e.currentTarget.parentElement?.childElementCount as number;
        const currentClass = e.currentTarget.classList.item(0) as string;

        if (currentClass == 'more-window') return;

        if (currentClass == 'rmore') {
            setShowMore(true);
            return;
        }

        for (let i = 0; i < siblingCount; i++) {
            const el = e.currentTarget.parentElement?.children.item(i);
            if (!el) continue;

            el.classList.remove('active-nav');
            if (el.classList[0] == currentClass)
                el.classList.add('active-nav');
            
            
        }
    }

    return <nav className="navbar" style={{ borderRightColor: lightTheme ? "#EBEEF0" : "#283340" }}>
        <div className="routes">
            <main className="branding">
                <img src={Brand} alt="twitter-logo" />
            </main>

            <div className="rhome active-nav" onClick={onNavLinkClick} onMouseOver={onOver} onMouseLeave={onLeave}>
                <FontAwesomeIcon icon={faHome} className="icon" />
                <span>Home</span>
            </div>

            <div className="rexplore" onClick={onNavLinkClick} onMouseOver={onOver} onMouseLeave={onLeave}>
                <FontAwesomeIcon icon={faHashtag} className="icon" />
                <span>Explore</span>
            </div>

            <div className="rnoti" onClick={onNavLinkClick} onMouseOver={onOver} onMouseLeave={onLeave}>
                <FontAwesomeIcon icon={faBell} className="icon" />
                <span>Notifications</span>
            </div>

            <div className="rprofile" onClick={onNavLinkClick} onMouseOver={onOver} onMouseLeave={onLeave}>
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span>Profile</span>
            </div>

            <div className="rmore" onClick={onNavLinkClick} onMouseOver={onOver} onMouseLeave={onLeave}>
                
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

            <button>Tweet</button>
        </div>

        <div className="user-flake" onMouseOver={onOver} onMouseLeave={onLeave}>
            <div className="user-flake-main">
                <img src="https://i.pinimg.com/236x/b5/8b/9d/b58b9d26e70af097afda7ecbcda9b8bb.jpg" alt="pfp" />
                <div className="user-details">
                    <span className="display">Rakshit</span>
                    <span 
                        className="username"
                        style={{ color: lightTheme ? '#5B7083' : '#8899A6' }}
                    >
                        @spuckhafte
                    </span>
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
    const { lightTheme, setLightTheme } = useContext(ThemeContext);
    function handleClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (
            (
                e.pageX < e.currentTarget.offsetLeft || 
                e.pageX > e.currentTarget.offsetLeft + e.currentTarget.offsetWidth
            ) ||
            (
                e.pageY < e.currentTarget.offsetTop || 
                e.pageY > e.currentTarget.offsetTop + e.currentTarget.offsetHeight
            )
        ) props.setShowMore(false);
    }

    const toggler = useRef<HTMLDivElement>(null);
    
    function toggleTheme() {
        if (!setLightTheme) return;
        if (lightTheme) setLightTheme(false);
        else setLightTheme(true);
    }

    return <div 
        className="more-window" 
        style={{ 
            backgroundColor: lightTheme ? "white" : "#17202A",
            boxShadow: `0 0 6px 7px ${lightTheme ? "#EBEEF0" : "#283340"}` 
        }} 
        onClick={handleClick}
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
        >
            Logout
        </div>
    </div>
}