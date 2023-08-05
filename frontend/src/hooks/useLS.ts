import { SetStateAction, useState } from "react"
import { getLocal, storeLocal } from "../helpers/funcs";

export default (key:string, initialValue:string|boolean) => {
    let previousValueInLS = getLocal(key) as string;
    if (previousValueInLS) 
        initialValue = previousValueInLS;

    if (initialValue == '<<false>>') initialValue = false;
    if (initialValue == '<<true>>') initialValue = true;
    
    const [state, _setState] = useState(initialValue);
    storeLocal(key, typeof initialValue == 'boolean' ? `<<${initialValue}>>` : initialValue);

    function setState(value:SetStateAction<string|boolean>) {
        _setState(value);
        const val = typeof value == "function" ? value(state) : value as string;
        storeLocal(key, typeof val == 'boolean' ? `<<${val}>>` : val);
    }

    return [state, setState] as [(string|boolean), (value: SetStateAction<string | boolean>) => void];
}