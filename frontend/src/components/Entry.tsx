import { useState, useContext } from 'react';
import EntryLogin from './EntryLogin';
import EntrySignup from './EntrySignup';
import Modal from './util/Modal';
import { AppContext, socket } from '../App';
import { incomingSockets, storeLocal } from '../helpers/funcs';
import { EntryData } from '../../../types';


export default () => {
    const [entryType, setEntryType] = useState('log');

    const [showOtpModal, setShowOtpModal] = useState(false); 
    const [otp, setOtp] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorReason, setErrorReason] = useState<string|JSX.Element>('');

    const { setLoadScreen, setLoggedIn } = useContext(AppContext);

    function handleEntryAlter() {
        if (showOtpModal || showErrorModal) return;
        setEntryType(entryType == 'log' ? 'sign' : 'log');
    }

    incomingSockets(() => {
        socket.on('entry-ok', async (entryData: EntryData) => {
            setOtp('');

            storeLocal('entryData', entryData);

            if (setLoggedIn) setLoggedIn(true);
            if (setLoadScreen) setLoadScreen(false);
        });
    });

    return (
        <div className="entry-page">
            <div className="entry">
                <img src="../../public/logo.png" alt="logo" />
                {
                    entryType === 'log' 
                    ? <EntryLogin
                        setErrorReason={setErrorReason}
                        setShowErrorModal={setShowErrorModal}
                    /> 
                    : <EntrySignup 
                        setOtpModal={setShowOtpModal}
                        otp={otp}
                        setErrorReason={setErrorReason}
                        setShowErrorModal={setShowErrorModal}
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
                    setShowModal={setShowOtpModal}
                />
                : ""
            }
            {
                showErrorModal 
                    ? <ErrorModal 
                        errorReason={errorReason} 
                        setShowModal={setShowErrorModal} 
                    /> 
                    : ""
            }
        </div>
    )
}

function ErrorModal(props: { errorReason: string|JSX.Element, setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    return <Modal 
        title={props.errorReason} 
        className="error-modal"
        setInputReturn={false}
        setShowModal={props.setShowModal}
    />
}