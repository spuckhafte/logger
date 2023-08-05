import { useState } from "react";
import { ALog, EntryData } from "../../../types";
import { getLocal, incomingSockets, runOnce } from "../helpers/funcs";
import { socket } from "../App";
import LogEl from './util/LogEl';

export default function HomeMain() {
    const { sessionId } = getLocal('entryData') as EntryData;

    const allLogs = document.getElementsByClassName("all-logs")[0];
    const [logs, setLogs] = useState<ALog[]>([]);
    const [lastId, setLastId] = useState<string|null>(null);

    // useEffect(() => {
    //     let startIndex = 0;
    //     if (lastId) {
    //         startIndex = logs.findIndex(log => log.id == lastId);
    //     }
    //     const reqLogs = logs.splice(startIndex, 10);


    //     createRoot(allLogs).render(JSX)
    // }, [lastId]);


    runOnce(() => {
        socket.emit('get-logs', sessionId, lastId);
    });

    incomingSockets(() => {
        socket.on('parsed-logs', (newLogs: ALog[]) => {
            if (newLogs && newLogs.length !== 0) {
                setLogs(logs.concat(newLogs));
                setLastId(newLogs[newLogs.length - 1].id);
            }
        });
    });

    return <div className="main">
        <div className="title">Home</div>
        <div className="all-logs">
            {
                logs.map(newLog => {
                    return <LogEl 
                        text={newLog.text} 
                        src={newLog.src} 
                        displayname={newLog.displayname}
                        username={newLog.username}
                        when={newLog.when}
                        id={newLog.id}
                        liked={newLog.liked}
                        totalLikes={newLog.totalLikes}
                        hashtag={newLog.hashtag ?? "unclassified"}
                    />
                }).reverse()
            }
        </div>
    </div>
}