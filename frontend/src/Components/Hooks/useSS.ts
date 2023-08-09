import { SetStateAction, useState } from "react"
import { getTemp, storeTemp } from "../Helpers/funcs";

export default <T>(key: string, initialValue: T) => {
    let previousValueInLS = getTemp(key) as T;
    if (previousValueInLS)
        initialValue = previousValueInLS;

    if (initialValue == '<<false>>') initialValue = false as T;
    if (initialValue == '<<true>>') initialValue = true as T;

    const [state, _setState] = useState(initialValue);
    storeTemp(key, typeof initialValue == 'boolean' ? `<<${initialValue}>>` : initialValue);

    function setState(value: SetStateAction<string | boolean>) {
        _setState(value as T);
        const val = typeof value == "function" ? value(state as string | boolean) : value as string;
        storeTemp(key, typeof val == 'boolean' ? `<<${val}>>` : val);
    }

    return [state, setState] as [T, (value: SetStateAction<T>) => void];
}