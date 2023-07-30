import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

type HybridInputProps = {
    type: "text"|"password"|"number",
    className: string,
    placeholder: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    limit?: number
}

export default function HybridInput(props:HybridInputProps) {
    const [className, setClassName] = useState(['hybrid-input', props.className]);
    const { value, setValue } = props;
    const [type, setType] = useState(props.type); 

    const inputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.onfocus = () => {
                titleRef.current?.classList.remove('dont-move-blur');
                setClassName([...className, 'focus-hybrid-input']);
            }
    
            inputRef.current.onblur = () => {
                titleRef.current?.classList.add('dont-move-blur');
                if (!value) setClassName(['hybrid-input', props.className]);
            }
        }
    }, [value, inputRef]);

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.value = '';
        inputRef.current.value = value;
    }, [type]);

    if (typeof props.limit == 'number') {
        useEffect(() => {
            titleRef.current?.setAttribute(
                'data-count', 
                `${value.length < ((props.limit ?? 0) / 2 + 1) ? "" : value.length}`
            );
            titleRef.current?.style.setProperty(
                '--wordcountcolor',
                `${value.length == props.limit ? 'red' : 'yellow'}`
            );
        }, [value]);
        
    } else {
        useEffect(() => {
            titleRef.current?.setAttribute('data-count', "");
        }, [titleRef])
    }

    function onValueChange(e:React.ChangeEvent<HTMLInputElement>) {
        if (typeof props.limit == 'number')
            if (e.target.value.length > props.limit) return;
        setValue(e.target.value);
    }

    function handleShowHide(e:React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault();
        setType(type == 'password' ? 'text' : 'password');
        inputRef.current?.setSelectionRange(value.length, value.length);
    }
    
    return <>
        <div className={className.join(' ')}>
            <div 
                // @ts-ignore
                ref={el => titleRef.current = el}
                onClick={() => inputRef.current?.focus()}
                data-count="0"
            >
                {props.placeholder}
            </div>
            <input
                type={type} 
                // @ts-ignore
                ref={el => inputRef.current = el} 
                value={value}
                onChange={onValueChange}
                spellCheck='false'
            />

            {
                props.type == 'password' ? 
                    <FontAwesomeIcon
                        icon={type == 'password' ? faEye : faEyeSlash} 
                        className={"show-hide-password " + (type == 'text' ? "hide-password" : "")}
                        onClick={e => handleShowHide(e)}
                        onMouseDown={e => e.preventDefault()}
                    />
                : ""
            }
        
        </div>
    </>
}