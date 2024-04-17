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

export const urlRegex = () => /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;