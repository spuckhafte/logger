import { EntryData, LoginData } from "../../../../types";
import { AppContext, socket } from "../../App";
import { getLocal, incomingSockets, runOnce, storeLocal } from "../Helpers/funcs";
import HybridInput from "../Utils/HybridInput";
import { useState, useContext } from 'react';

type LoginProps = {
    setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>
    setErrorReason: React.Dispatch<React.SetStateAction<string|JSX.Element>>
}
export default function EntryLogin(props: LoginProps) {
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const { setLoadScreen, setLightTheme, lightTheme } = useContext(AppContext);

    // auto-login
    runOnce(() => {
        const prevSessionId = (getLocal('entryData') as EntryData|null)?.sessionId;
        if (prevSessionId) {
            if (setLoadScreen) setLoadScreen(true);
            socket.emit('login', { sessionId: prevSessionId });
        } else {
            if (setLightTheme && lightTheme) setLightTheme(false);
        }
    });

    function handleSignIn() {
        if (!loginName || !loginPassword) return;
        if (setLoadScreen) setLoadScreen(true);

        const userData: LoginData = {
            username: loginName,
            password: loginPassword
        }
        socket.emit('login', userData);
    }

    incomingSockets(() => {
        socket.on('login-failed', reason => {
            if (setLoadScreen) setLoadScreen(false);
            if (setLightTheme && lightTheme) setLightTheme(false);
            props.setErrorReason(reason);
            props.setShowErrorModal(true);
        });

        socket.on('auto-login-failed', () => {
            if (setLoadScreen) setLoadScreen(false);
            if (setLightTheme && lightTheme) setLightTheme(false);
            storeLocal('sessionid', '');
        })
    })

    return <>
        <div className="text">Sign in to Logger</div>

        <div className="reg-office">
            <HybridInput 
                type="text" className="username" 
                placeholder="username" 
                value={loginName} setValue={setLoginName}
                limit={32}
            />
            <HybridInput
                type="password" className="password"
                placeholder="password"
                value={loginPassword} setValue={setLoginPassword}
                limit={16}
            />

            <button 
                className="sign-in-btn" 
                onClick={handleSignIn}
                style={{ cursor: (!loginName || !loginPassword) ? "default" : "pointer" }}
            >Sign In</button>
        </div>
    </>
}