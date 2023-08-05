import HomeNav from "./HomeNav"
import HomeMain from "./HomeMain";

export default () => {
    return <>
        <div className="home">
            <HomeNav />

            <HomeMain />

            <div className="events"></div>
        </div>
    </>
}