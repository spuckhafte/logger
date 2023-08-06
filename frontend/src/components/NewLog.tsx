import { useContext, useState } from "react";
import Modal from "./util/Modal";
import { AppContext, socket } from "../App";
import HybridTextArea from "./util/HybridTextArea";
import useSS from "../hooks/useSS";
import HybridInput from "./util/HybridInput";
import { EntryData, PublishLog } from "../../../types";
import { getLocal } from "../helpers/funcs";

export default function NewLog() {
    const { setNewLogScreen, setLoadScreen } = useContext(AppContext);

    const { sessionId } = getLocal('entryData') as EntryData;

    const [log, setLog] = useSS('newLogText', '');
    const [tag, setTag] = useState('');
    const [showErr, setShowErr] = useState(false);

    if (!setNewLogScreen) return;

    function publishLog() {
        if (!log) {
            setShowErr(true);
            return;
        }

        const myNewLog: PublishLog = {
            text: log.trim(),
            hashtag: tag.trim(),
            sessionId: sessionId ?? ""
        }

        socket.emit('publish-log', myNewLog);
        setLog('');
        if (setLoadScreen) setLoadScreen(true);
        
    }

    const newLogDiv = <div className="content">
        <div className="title">Publish a new log</div>
        <HybridTextArea 
            className="new-log-text" 
            placeholder="What's on your mind?!" 
            value={log} 
            setValue={setLog}
            limit={180}
        />
        <div className="new-tag">
            <div className="tag-symbol">#</div>
            <HybridInput 
                type="text" 
                className="new-tag-text" 
                value={tag} 
                setValue={setTag} 
                placeholder="Topic"
                limit={24}
            />
        </div>

        <button className="create-new-log-btn" onClick={publishLog}>Publish</button>
    </div>;

    return <>
        <Modal 
            title={newLogDiv}
            className="create-new-log"
            setInputReturn={false}
            setShowModal={setNewLogScreen}
        />
        {
            showErr
            ? <Modal 
                title={<b>Log can't be empty!</b>}
                className="error-new-log" 
                setInputReturn={false} 
                setShowModal={setShowErr}
                blur={true}
            /> : ""
        }
    </>
}