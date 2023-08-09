import { useParams } from "react-router-dom";
import AllLogs from "../../../Utils/AllLogs";

export default function Topic() {
    const { topic } = useParams() as { topic: string };

    return <div className="a-hashtag">
        <div className="main">
            <AllLogs heading={topic} filterTag={topic} aHashtag={true} />
        </div>

        <div className="topic-about"></div>
    </div>
}