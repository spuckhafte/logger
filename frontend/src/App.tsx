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

  setNewLogScreen?: (value: React.SetStateAction<boolean>) => void
}>({});

export default function App() {
    const [lightTheme, setLightTheme] = useLS('app-theme', true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loadScreen, setLoadScreen] = useState(false);
    const [newLogScreen, setNewLogScreen] = useState(false);

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
            setNewLogScreen
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
                        <Route path='/explore/:topic' element={ <Topic/> }/>
                    </Routes>
                </main>
                : <EntryModal />
        }
    </AppContext.Provider>
    )
}