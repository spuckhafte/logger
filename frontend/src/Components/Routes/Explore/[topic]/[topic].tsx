import { useParams } from "react-router-dom";
import AllLogs from "../../../Utils/AllLogs";
import { beautifyTime, getLocal, incomingSockets, runOnce } from "../../../Helpers/funcs";
import { AppContext, socket } from "../../../../App";
import { EntryData, HashtagInfo } from "../../../../../../types";
import { useContext, useState } from "react";
import millify from "millify";
import useWindowWidth from "../../../Hooks/useWindowWidth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faInfo } from "@fortawesome/free-solid-svg-icons";

export default function Topic() {
    const { topic } = useParams() as { topic: string };
    const { sessionId } = getLocal('entryData') as EntryData;

    const [topicInfo, setTopicInfo] = useState({} as HashtagInfo);
    const { changeActiveNav } = useContext(AppContext);
    const windowWidth = useWindowWidth();

    const [showAbout, setShowAbout] = useState(true); 

    const { firstLog, totalLogs, lastActive, myLogs } = topicInfo;

    runOnce(() => {
        socket.emit('get-hashtag-details', topic, sessionId);

        if (changeActiveNav) changeActiveNav('explore');
    });

    incomingSockets(() => {
        socket.on('hashtag-details', (tagDetails: HashtagInfo) => {
            setTopicInfo(tagDetails);
        });
    })

    return <div className="a-hashtag">
        <div className="main">
            <AllLogs filterTag={topic} aHashtag={true} />
        </div>

        <div className={`topic-about topic-about-${showAbout ? "show" : "hide"}`}>
            {
                showAbout ?
                <div className="details-card">
                    <div className="topic-name" title={topic}>
                        <span> #{topic} </span>
                        {
                            windowWidth != "large" &&
                            <div>
                                <FontAwesomeIcon 
                                    icon={faAngleRight}
                                    onClick={() => setShowAbout(false)}
                                />
                            </div>
                        }
                    </div>
                    <div className="heading">About topic</div>
                
                
                    <div className="describe">
                        <div className="info">
                            <div className="last-active">{lastActive ? beautifyTime(lastActive) : "--"} ago<div className="subhead">last active</div></div>
                            <div className="first-log">{firstLog ? beautifyTime(firstLog) : "--"} ago<div className="subhead">first log</div></div>
                        
                        </div>
                        <div className="stats">
                            <div className="total-logs">{totalLogs ? millify(+totalLogs) : "--"}<div className="subhead">total logs</div></div>
                            <div className="my-logs">{myLogs ? millify(+myLogs) : "--"}<div className="subhead">my logs</div></div>
                        </div>
                    </div>
                </div>
                : <div 
                    onClick={() => setShowAbout(true)} 
                    style={{ width: "100%", height: "100%" }}
                >
                    <FontAwesomeIcon icon={faInfo} />
                </div>
            }
        </div>
    </div>
}
