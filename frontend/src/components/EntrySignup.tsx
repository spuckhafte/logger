import { socket } from "../App";
import HybridInput from "./util/HybridInput";
import { useEffect, useRef, useState } from 'react';
import { AuthData } from '../../../types';

type Props = {
    setOtpModal: React.Dispatch<React.SetStateAction<boolean>>
    otp: string
}
export default function EntrySignup(props: Props) {
    const [signupMail, setSignupMail] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const otpFromServer = useRef<string>();

    function handleFormSubmit() {
        const userData: AuthData = {
            username: signupName,
            password: signupPassword,
            email: signupMail
        }
        socket.emit('signup-verify', userData);
    }

    document.addEventListener('click', e => {
        const otpModal = document.getElementsByClassName('otp-modal')[0];
        const joinBtn = document.getElementsByClassName('sign-in-btn')[0];

        if (!otpModal?.contains(e.target as Node) && !joinBtn?.contains(e.target as Node))
            props.setOtpModal(false);
    });


    // ---incoming sockets---
    const delta = useRef(0);
    useEffect(() => {
        if (delta.current == 1) return; // make sure that sockets only register once
        delta.current = 1;

        socket.on('verify-otp', (otp: string) => {
            otpFromServer.current = otp;
            props.setOtpModal(true);
        });

        socket.on('signup-ok', async (securePassword: string) => {
            console.log('LoggedIn ' + securePassword);
        });
    }, []);


    // verify otp
    useEffect(() => {
        if (props.otp) {
            if (props.otp.trim() === otpFromServer.current) {
                socket.emit('verified');
                props.setOtpModal(false);
            } else alert('wrong otp');
        }
    }, [props.otp]);

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

            <button className="sign-in-btn" onClick={handleFormSubmit}>Join</button>
        </div>
    </>
}