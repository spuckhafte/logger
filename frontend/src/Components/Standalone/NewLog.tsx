import { useContext, useState } from "react";
import Modal from "../Utils/Modal";
import { AppContext, socket } from "../../App";
import HybridTextArea from "../Utils/HybridTextArea";
import useSS from "../Hooks/useSS";
import HybridInput from "../Utils/HybridInput";
import { EntryData, PublishLog } from "../../../../types";
import { getLocal } from "../Helpers/funcs";

export default function NewLog() {
    const { setNewLogScreen, setLoadScreen } = useContext(AppContext);

    const topic = location.href.split('explore/')[1] as string|undefined;

    const { sessionId } = getLocal('entryData') as EntryData;

    const [log, setLog] = useSS('newLogText', '');
    const [tag, setTag] = useState(topic ? topic : "");
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
                blocked={!!topic}
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