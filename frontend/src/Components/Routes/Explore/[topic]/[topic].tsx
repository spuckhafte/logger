import { useParams } from "react-router-dom";
import AllLogs from "../../../Utils/AllLogs";
import { getLocal, incomingSockets, runOnce } from "../../../Helpers/funcs";
import { socket } from "../../../../App";
import { EntryData, HashtagInfo } from "../../../../../../types";
import { useState } from "react";
import millify from "millify";
import prettyMilliseconds from "pretty-ms";

export default function Topic() {
    const { topic } = useParams() as { topic: string };
    const { sessionId } = getLocal('entryData') as EntryData;

    const [topicInfo, setTopicInfo] = useState({} as HashtagInfo);

    const { firstLog, totalLogs, lastActive, myLogs } = topicInfo;

    runOnce(() => {
        socket.emit('get-hashtag-details', topic, sessionId);
    });

    incomingSockets(() => {
        socket.on('hashtag-details', (tagDetails: HashtagInfo) => {
            setTopicInfo(tagDetails);
        })
    })

    return <div className="a-hashtag">
        <div className="main">
            <AllLogs filterTag={topic} aHashtag={true} />
        </div>

        <div className="topic-about">
            <div className="details-card">
                <div className="topic-name" title={topic}>#{topic}</div>
                <div className="heading">About topic</div>
                
                
                <div className="describe">
                    <div className="info">
                        <div className="first-log">{firstLog ? pms(+firstLog) : "--"} ago<div className="subhead">first log</div></div>
                        <div className="last-active">{lastActive ? pms(+lastActive) : "--"} ago<div className="subhead">last active</div></div>
                    </div>
                    <div className="stats">
                        <div className="total-logs">{totalLogs ? millify(+totalLogs) : "--"}<div className="subhead">total logs</div></div>
                        <div className="my-logs">{myLogs ? millify(+myLogs) : "--"}<div className="subhead">my logs</div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function pms(num: number) {
    return prettyMilliseconds(Date.now() - num, { compact: true })
}