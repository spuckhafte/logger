import { useState } from 'react';
import EntryLogin from './EntryLogin';
import EntrySignup from './EntrySignup';


export default () => {
    const [entryType, setEntryType] = useState<'log'|'sign'>('log');

    function handleEntryAlter() {
        setEntryType(entryType == 'log' ? 'sign' : 'log');
    }

    return (
        <div className="entry-page">
            <div className="entry">
                <img src="../../public/vite.svg" alt="logo" />
                {
                    entryType === 'log' ? <EntryLogin /> : <EntrySignup />
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
        </div>
    )
}