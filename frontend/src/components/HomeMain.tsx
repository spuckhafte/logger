import { useState, useContext, useEffect } from "react";
import { ALog, EntryData } from "../../../types";
import { getLocal, incomingSockets, runOnce } from "../helpers/funcs";
import { AppContext, socket } from "../App";
import LogEl from './util/LogEl';

export default function HomeMain() {
    const { sessionId } = getLocal('entryData') as EntryData;

    const { setLoadScreen, setNewLogScreen } = useContext(AppContext);
    const [logs, setLogs] = useState<ALog[]>([]);
    const [lastId, setLastId] = useState<string|null>(null);

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

        socket.on('new-log', (newLog: ALog, me: boolean) => {
            setLogs(prev => [...prev, newLog]);
            if (me && setLoadScreen && setNewLogScreen) {
                setLoadScreen(false);
                setNewLogScreen(false);
            }
        });

        socket.on('update-like', (logId: string, totalLikes: number) => {
            console.log('here')
            setLogs(prev => {
                return prev.map(log => log.id == logId ? { ...log, totalLikes } : log);
            });
        });
    });

    return <div className="main">
        <div className="title">Home</div>
        <div className="all-logs">
            {
                logs.map((newLog, i) => {
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
                        key={i}
                    />;
                }).reverse()
            }
        </div>
    </div>
}