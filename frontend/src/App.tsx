import { Route, Routes } from 'react-router-dom';          
import { createContext, useState } from 'react';      
import Home from './components/Home';
import useLS from './hooks/useLS';
import EntryModal from './components/Entry';
import { io } from 'socket.io-client';

export const socket = io("http://localhost:3000");

export const AppContext = createContext<{ 

  lightTheme?:boolean, 
  setLightTheme?: (value: React.SetStateAction<string | boolean>) => void,

  loggedIn?:boolean,
  setLoggedIn?: (value: React.SetStateAction<boolean>) => void

}>({});

type ThemeStyle = { backgroundColor: string, color: string }
export function getThemeStyle(lightTheme:boolean): ThemeStyle {
  return new Object({
    backgroundColor: lightTheme ? "white" : "#17202A",
    color: lightTheme ? "black" : "white"
  }) as ThemeStyle;
}

export default function App() {
  const [lightTheme, setLightTheme] = useLS('app-theme', true);
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <AppContext.Provider 
        value={{ 
            lightTheme: lightTheme as boolean, 
            setLightTheme, 
            loggedIn, 
            setLoggedIn
        }}
    >
      <Routes>
        <Route path='/' element={ loggedIn ? <Home /> : <EntryModal /> } />
      </Routes>
    </AppContext.Provider>
  )
}