import prettyMilliseconds from "pretty-ms";
import { useEffect, useRef } from "react";

export function runNTimes(func: (() => void), N=1) {
    const delta = useRef(0);
    useEffect(() => {
        if (delta.current == N) return; // make sure the  "func" only run N times
        delta.current += 1;

        func();
    }, []);
}

export function runOnce(func: (() => void)) {
    runNTimes(func);
}

export function incomingSockets(register: (() => void)) {
    runOnce(register);
}

export function storeLocal(key: string, data: any) {
    if (typeof data == 'object') {
        data = JSON.stringify(data) + ">>object";
    }
    localStorage.setItem(`logger-${key}`, data as string);
}

export function storeTemp(key: string, data: any) {
    if (typeof data == 'object') {
        data = JSON.stringify(data) + ">>object";
    }
    sessionStorage.setItem(`logger-${key}`, data as string);
}

export function getLocal(key: string) {
    let item = localStorage.getItem(`logger-${key}`);
    if (!item) return item;
    if (item.includes(">>object")) {
        item = JSON.parse(item.split('>>object')[0]);
    }
    return item as unknown;
}

export function getTemp(key: string) {
    let item = sessionStorage.getItem(`logger-${key}`);
    if (!item) return item;
    if (item.includes(">>object")) {
        item = JSON.parse(item.split('>>object')[0]);
    }
    return item as unknown;
}

export function beautifyTime(time?: string) {
    let ago = prettyMilliseconds(Date.now() - +(time ?? 0)).split(' ')[0];
    
    if (ago.includes('d'))
        if (parseInt(ago) >= 365)
            ago = (parseInt(ago) / 365).toFixed(0) + 'y';
        else if (parseInt(ago) >= 30)
            ago = (parseInt(ago) / 30).toFixed(0) + 'mo';
        else if (parseInt(ago) >= 7)
            ago = (parseInt(ago) / 7).toFixed(0) + 'w';
        else ago = ago;

    return ago.replace(/m\b/g, 'mi');
}

export const urlRegex = () => /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
