import { SetStateAction, useState } from "react"

export default (key:string, initialValue:string|boolean) => {
    let previousValueInLS = localStorage.getItem(key);
    if (previousValueInLS) 
        initialValue = previousValueInLS;

    if (initialValue == '<<false>>') initialValue = false;
    if (initialValue == '<<true>>') initialValue = true;
    
    const [state, _setState] = useState(initialValue);
    localStorage.setItem(key, typeof initialValue == 'boolean' ? `<<${initialValue}>>` : initialValue);

    function setState(value:SetStateAction<string|boolean>) {
        _setState(value);
        const val = typeof value == "function" ? value(state) : value as string;
        localStorage.setItem(key, typeof val == 'boolean' ? `<<${val}>>` : val);
    }

    return [state, setState] as [(string|boolean), (value: SetStateAction<string | boolean>) => void];
}