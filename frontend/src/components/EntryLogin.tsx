import HybridInput from "./util/HybridInput";
import { useState } from 'react';

export default function EntryLogin() {
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    return <>
        <div className="text">Sign in to Twitter</div>

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

            <button className="sign-in-btn">Sign In</button>
        </div>
    </>
}