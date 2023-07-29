import HybridInput from "./util/HybridInput";
import { useState } from 'react';

export default function EntrySignup() {
    const [signupMail, setSignupMail] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    return <>
        <div className="text">Join Twitter today</div>

        <div className="reg-office">
            <HybridInput 
                type="text" className="email" 
                placeholder="email" 
                value={signupMail} setValue={setSignupMail}
                limit={320}
            />
            <HybridInput 
                type="text" className="username" 
                placeholder="username" 
                value={signupName} setValue={setSignupName}
                limit={32}
            />
            <HybridInput
                type="password" className="password"
                placeholder="password"
                value={signupPassword} setValue={setSignupPassword}
                limit={16}
            />

            <button className="sign-in-btn">Join</button>
        </div>
    </>
}