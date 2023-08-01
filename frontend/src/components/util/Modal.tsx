import HybridInput from "./HybridInput";
import { useState } from 'react';

type ModalProps = {
    title: string | JSX.Element
    className: string
    
    /**
     * External state setter that will save the input.
     * 
     * If `false` there will be no input in the modal.
    */
    setInputReturn: false | React.Dispatch<React.SetStateAction<string>>
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    placeholder?: string
    max?: number
    btnText?: string
}
export default function Modal(props: ModalProps) {
    const { title, setInputReturn, className } = props;

    const [value, setValue] = useState('');

    function handleSubmit() {
        if (setInputReturn) {
            setInputReturn(value);
        }
    }

    function closeModal(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (e.target == e.currentTarget) {
            props.setShowModal(false);
        }
    }

    return <div className="external-modal-screen" onClick={closeModal}>
            <div className={`external-modal ${className}`}>
            <div className="title">{title}</div>
            {
                setInputReturn 
                ? <div className="modal-input-wrapper">
                    <HybridInput 
                        type="text" 
                        className="modal-input" 
                        placeholder={props.placeholder ?? "Enter the text here..."}
                        value={value} setValue={setValue}
                        limit={props.max}
                    />
                    <button onClick={handleSubmit}>{props.btnText ?? "Submit"}</button>
                </div> : ""
            }
        </div>
    </div>
}