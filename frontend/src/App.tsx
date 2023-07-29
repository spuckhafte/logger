import { Route, Routes } from 'react-router-dom';          
import { createContext, useState } from 'react';      
import Home from './components/Home';
import useLS from './hooks/useLS';
import EntryModal from './components/Entry';

export const ThemeContext = createContext<{ 
  lightTheme?:boolean, 
  setLightTheme?: (value: React.SetStateAction<string | boolean>) => void
}>({});
  
export function getThemeStyle(lightTheme:boolean): { backgroundColor: string, color: string } {
  return new Object({
    backgroundColor: lightTheme ? "white" : "#17202A",
    color: lightTheme ? "black" : "white"
  }) as { backgroundColor: string, color: string };
}

export default function App() {
  const [lightTheme, setLightTheme] = useLS('app-theme', true);
  const [loggedIn, _setLoggedIn] = useState(false);
  
  return (
    <ThemeContext.Provider value={{ lightTheme: lightTheme as boolean, setLightTheme }}>
      <Routes>
        <Route path='/' element={ loggedIn ? <Home /> : <EntryModal /> } />
      </Routes>
    </ThemeContext.Provider>
  )
}