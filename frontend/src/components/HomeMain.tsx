import { useState, useContext, useRef, useEffect } from "react";
import { ALog, EntryData } from "../../../types";
import { getLocal, incomingSockets, runOnce } from "../helpers/funcs";
import { AppContext, socket } from "../App";
import LogEl from './util/LogEl';

export default function HomeMain() {
    

    const { sessionId } = getLocal('entryData') as EntryData;

    const { setLoadScreen, setNewLogScreen } = useContext(AppContext);
    const [logs, setLogs] = useState<ALog[]>([]);
    const [lastId, setLastId] = useState<string|null>(null);
    const [isLastLog, setIsLastLog] = useState(false);

    const allLogsEl = useRef<HTMLDivElement>(null);
    const loaderEl = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     console.log(loaderEl);
    //     if (
    //         !isLastLog && 
    //         allLogsEl.current && 
    //         allLogsEl.current.scrollHeight > allLogsEl.current.clientHeight
    //     ) {
    //         console.log('here');
    //     }
    // }, [isLastLog]);

    runOnce(() => {
        socket.emit('get-logs', sessionId, lastId);
    });

    incomingSockets(() => {
        socket.on('parsed-logs', (newLogs: ALog[], lastLog: boolean) => {
            setIsLastLog(lastLog);
            if (newLogs && newLogs.length !== 0) {
                
                setLogs(prevLogs => prevLogs.concat(newLogs));
                setLastId(newLogs[newLogs.length - 1].id);
            }
        });

        socket.on('new-log', (newLog: ALog, me: boolean) => {
            setLogs(prev => [newLog, ...prev]);
            if (me && setLoadScreen && setNewLogScreen) {
                setLoadScreen(false);
                setNewLogScreen(false);
            }
        });

        socket.on('update-like', (logId: string, totalLikes: number) => {
            setLogs(prev => {
                return prev.map(log => log.id == logId ? { ...log, totalLikes } : log);
            });
        });
    });

    function allLogsScrolled(e: React.UIEvent<HTMLDivElement, UIEvent>) {
        const {scrollHeight, scrollTop, clientHeight} = e.currentTarget;

        const scroll = Math.abs(scrollHeight - clientHeight - scrollTop);
        if (scroll < 1) {
            socket.emit('get-logs', sessionId, lastId);
        }
    }

    return <div className="main">
        <div className="title">Home</div>
        <div className="all-logs" ref={allLogsEl} onScroll={allLogsScrolled}>
            {
                logs.map((newLog, i) => {
                    let El = <LogEl 
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

                    if (i == logs.length - 1 && !isLastLog) {
                        El = <div key={i}>
                            {El}
                            <div className="load-more-logs" id="loadMoreLogs" ref={loaderEl}>
                                <div className="loader"></div>
                            </div>
                        </div>
                    }

                    return El;
                })
            }
        </div>
    </div>
}

// function scrollbar(el: HTMLDivElement) {
//     return el;
// }