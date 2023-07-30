import { useState } from 'react';
import EntryLogin from './EntryLogin';
import EntrySignup from './EntrySignup';
import Modal from './util/Modal';
import useLS from '../hooks/useLS';


export default () => {
    const [entryType, setEntryType] = useLS('sign-in-mode', 'log');

    const [showOtpModal, setShowOtpModal] = useState(false); 
    const [otp, setOtp] = useState('');

    function handleEntryAlter() {
        if (showOtpModal) return;
        setEntryType(entryType == 'log' ? 'sign' : 'log');
    }

    return (
        <div className="entry-page">
            <div 
                className="entry" 
                style={{ 
                    filter: `blur(${showOtpModal ? '10px' : '0'})` 
                }}
            >
                <img src="../../public/vite.svg" alt="logo" />
                {
                    entryType === 'log' 
                    ? <EntryLogin /> 
                    : <EntrySignup 
                        setOtpModal={setShowOtpModal} 
                        otp={otp} 
                    />
                }
                <br />
                <div className='alter-entry'>
                    {
                        entryType == 'log' 
                        ? "Have an account already? "
                        : "Don't have an account? "
                    }
                    <span className='alter-action' onClick={handleEntryAlter}>
                        {entryType == 'log' ? 'Sign up' : 'Sign in'}
                    </span>
                </div>
            </div>
            {
            showOtpModal 
            ? <Modal 
                title="OTP sent!" 
                setInputReturn={setOtp} 
                className="otp-modal" 
                placeholder="OTP"
                max={5}
                btnText='Verify'
            />
            : ""
        }
        </div>
    )
}