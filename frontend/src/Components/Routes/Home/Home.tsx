import { useState } from "react"
import AllLogs from "../../Utils/AllLogs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default () => {
    const [showEvents, setShowEvents] = useState(false);

    return <>
        <div className="home">

            <div className="main">
                <AllLogs heading="Home" headingBtnFunc={() => setShowEvents(!showEvents)}/>
            </div>


            <div className={`events ${showEvents ? '' : "hideEvents"}`}>
                {
                    showEvents &&
                    <div className="cancelEvents">
                        <FontAwesomeIcon 
                            icon={faTimes}
                            size="xl"
                            onClick={() => setShowEvents(!showEvents)}
                        />
                    </div>
                }
            </div>
        </div>
    </>
}
