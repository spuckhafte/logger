import { Route, Routes } from 'react-router-dom';          
import { createContext, useEffect, useState } from 'react';      
import Home from './components/Home';
import useLS from './hooks/useLS';
import EntryModal from './components/Entry';
import { io } from 'socket.io-client';
import NewLog from './components/NewLog';

export const socket = io("https://logger-server.onrender.com");

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
        <Routes>
            <Route path='/' element={ loggedIn ? <Home /> : <EntryModal /> } />
        </Routes>
    </AppContext.Provider>
    )
}