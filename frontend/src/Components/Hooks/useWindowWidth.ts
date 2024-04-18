import { useEffect, useState } from "react";

const midWidth = 970;
const smallWidth = 650;

export default function useWindowWidth() {
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setScreenSize(window.innerWidth));
        return () => {
            window.addEventListener("resize", () => setScreenSize(window.innerWidth));
        };
    }, []);
    
    if (screenSize >= midWidth)
        return "large";
    else if (screenSize >= smallWidth)
        return "mid";
    else 
        return "small";
}
