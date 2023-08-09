import { useEffect, useRef, useState } from 'react';
import { runOnce } from '../Helpers/funcs';

type HybridInputProps = {
    className: string,
    placeholder: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    limit?: number
}

export default function HybridTextArea(props:HybridInputProps) {
    const [className, setClassName] = useState(['hybrid-input', props.className]);
    const { value, setValue } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    runOnce(() => {
        if (value) {
            if (!titleRef.current?.classList.contains('focus-hybrid-input'))
                setClassName([...className, 'focus-hybrid-input']);
        }
    })

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.onfocus = () => {
                titleRef.current?.classList.remove('dont-move-blur');
                if (!titleRef.current?.classList.contains('focus-hybrid-input'))
                    setClassName([...className, 'focus-hybrid-input']);
            }
    
            inputRef.current.onblur = () => {
                titleRef.current?.classList.add('dont-move-blur');
                if (!value) setClassName(['hybrid-input', props.className]);
            }
        }
    }, [value, inputRef]);

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

    function onValueChange(e:React.ChangeEvent<HTMLTextAreaElement>) {
        if (typeof props.limit == 'number')
            if (e.target.value.length > props.limit) return;
        setValue(e.target.value);
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
            <textarea
                // @ts-ignore
                ref={el => inputRef.current = el} 
                value={value}
                onChange={onValueChange}
                spellCheck='false'
            />
    
        </div>
    </>
}