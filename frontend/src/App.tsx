import { Route, Routes } from 'react-router-dom';          
import { createContext, useEffect, useState } from 'react';      
import Home from './Components/Routes/Home/Home';
import useLS from './Components/Hooks/useLS';
import EntryModal from './Components/Standalone/Entry';
import { io } from 'socket.io-client';
import NewLog from './Components/Standalone/NewLog';
import HomeNav from './Components/Standalone/Navbar';
import Topic from './Components/Routes/Explore/[topic]/[topic]';
import { incomingSockets, storeLocal } from './Components/Helpers/funcs';
import Explore from './Components/Routes/Explore/Explore';
import Noti from './Components/Routes/Noti/Noti';
import Profile from './Components/Routes/Profile/Profile';

const SERVER = {
    dev: "http://localhost:3000",
    production: "https://logger-server.onrender.com"
}

export const socket = io(SERVER[import.meta.env.VITE_ENV as "dev"|"production"]);

export const AppContext = createContext<{ 
    lightTheme?:boolean, 
    setLightTheme?: (value: React.SetStateAction<string | boolean>) => void,

    loggedIn?:boolean,
    setLoggedIn?: (value: React.SetStateAction<boolean>) => void

    loadScreen?:boolean,
    setLoadScreen?: (value: React.SetStateAction<boolean>) => void

    activeNav?: {
        home: boolean;
        explore: boolean;
        noti: boolean;
        profile: boolean;
        more: boolean
    }
    changeActiveNav?: ((navLink: "explore" | "home" | "noti" | "profile" | "more") => void)

  setNewLogScreen?: (value: React.SetStateAction<boolean>) => void
}>({});

export default function App() {
    const [lightTheme, setLightTheme] = useLS('app-theme', true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loadScreen, setLoadScreen] = useState(false);
    const [newLogScreen, setNewLogScreen] = useState(false);
    const [activeNav, setActiveNav] = useState({
        home: true,
        explore: false,
        noti: false,
        profile: false,
        more: false
    });

    function changeActiveNav(navLink: keyof typeof activeNav) {
        setActiveNav(prev => {
            const alreadyActive = Object.keys(prev).find(link => prev[link as keyof typeof prev]) as string;
            const newNavLinkMap = { 
                ...prev,
                [alreadyActive]: false,
                [navLink]: true
            }
            return newNavLinkMap;
        });
    }

    useEffect(() => {
        document.body.style.setProperty(
            '--scrolltrack',
            lightTheme ? "#283340" : "white"
        );
        document.body.style.setProperty(
            '--border',
            lightTheme ? "#EBEEF0" : "#283340"
        );
        document.body.style.setProperty(
            '--bg',
            lightTheme ? "white" : "#17202A"
        );
        document.body.style.setProperty(
            '--color',
            lightTheme ? "black" : "white"
        );
        document.body.style.setProperty(
            '--bghover',
            lightTheme ? "#EBEEF0" : "#283340"
        );
        document.body.style.setProperty(
            '--modalBg',
            lightTheme ? "white" : "black"
        );
        document.body.style.setProperty(
            '--hybridTextPlaceholder',
            lightTheme ? "#3A444C" : "#8899A6"
        );
        document.body.style.setProperty(
            '--bgsyncblacknwhite',
            lightTheme ? "#F7F9FA" : "#1C2733"
        );
    }, [lightTheme]);

    incomingSockets(() => {
        socket.on('session-expired', () => {
            storeLocal('entryData', '');
            location.reload();
        })
    })

    return (
    <AppContext.Provider 
        value={{ 
            lightTheme: lightTheme as boolean, 
            setLightTheme, 
            loggedIn,
            setLoggedIn,
            loadScreen,
            setLoadScreen,
            setNewLogScreen,
            activeNav,
            changeActiveNav
        }}
    >
        { 
            loadScreen ? <div className='loadscreen'>
                <div className='loader-path'></div>
                <div className='loader-tail'></div>
            </div> : "" 
        }
        {
            newLogScreen ? <NewLog /> : ""
        }
        {
            loggedIn
                ? <main className='the-app'>
                    <HomeNav />
                    <Routes>
                        <Route path='/' element={ <Home /> } />
                        
                        <Route path='/home' element={ <Home /> } />
                        <Route path='/explore' element={ <Explore /> } />
                        <Route path='/noti' element={ <Noti /> }/>
                        <Route path='/profile' element={ <Profile /> }/>

                        <Route path='/explore/:topic' element={ <Topic/> }/>
                    </Routes>
                </main>
                : <EntryModal />
        }
    </AppContext.Provider>
    )
}
