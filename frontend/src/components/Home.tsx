import HomeNav from "./HomeNav"
import { useContext } from "react";
import { AppContext, getThemeStyle } from "../App";

export default () => {
    const { lightTheme } = useContext(AppContext);

    return <>
        <div className="home" style={getThemeStyle(lightTheme ?? false)}>
            <HomeNav />

            <div className="main"></div>

            <div className="events"></div>
        </div>
    </>
}