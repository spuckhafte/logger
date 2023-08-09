import { AppContext, socket } from "../../App";
import HybridInput from "../Utils/HybridInput";
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthData } from '../../../../types';
import { incomingSockets } from "../Helpers/funcs";
import { passwordValidator, usernameValidator } from "../Helpers/validator";
import EmailValidator from 'email-validator';

type Props = {
    setOtpModal: React.Dispatch<React.SetStateAction<boolean>>
    otp: string,
    setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>
    setErrorReason: React.Dispatch<React.SetStateAction<string|JSX.Element>>
}
export default function EntrySignup(props: Props) {
    const [signupMail, setSignupMail] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const { setLoadScreen, lightTheme, setLightTheme } = useContext(AppContext);

    const otpFromServer = useRef<string>();
    
    if (setLightTheme && lightTheme) setLightTheme(false);

    function handleFormSubmit() {
        if (!EmailValidator.validate(signupMail)) {
            props.setErrorReason('Invalid Mail');
            props.setShowErrorModal(true);
            return;
        }

        const usernameValidated = usernameValidator(signupName);
        if (usernameValidated !== true) {
            props.setErrorReason(usernameValidated);
            props.setShowErrorModal(true);
            return;
        }

        const passwordValidated = passwordValidator(signupPassword);
        if (passwordValidated !== true) {
            props.setErrorReason(passwordValidated);
            props.setShowErrorModal(true);
            return;
        }
        

        if (setLoadScreen) setLoadScreen(true);
        const userData: AuthData = {
            username: signupName,
            password: signupPassword,
            email: signupMail
        }
        socket.emit('signup-verify', userData);
    }

    // verify otp
    useEffect(() => {
        if (props.otp) {
            if (props.otp.trim() === otpFromServer.current) {
                socket.emit('verified');
                props.setOtpModal(false);
            } else {
                props.setErrorReason('Wrong OTP!');
                props.setShowErrorModal(true);
            }
        }
    }, [props.otp]);


    incomingSockets(() => {
        socket.on('verify-otp', (otp: string) => {
            if (setLoadScreen) setLoadScreen(false);
            otpFromServer.current = otp;
            props.setOtpModal(true);
        });

        socket.on('verification-error', (reason: string) => {
            if (setLoadScreen) setLoadScreen(false);                        
            props.setErrorReason(reason);
            props.setShowErrorModal(true);

            setTimeout(() => {
                props.setShowErrorModal(false);
            }, 2.5 * 1000);
        });
    });

    return <>
        <div className="text">Join Logger today</div>

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