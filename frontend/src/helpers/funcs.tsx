import { useEffect, useRef } from "react";

export function runOnce(func: (() => void)) {
    const delta = useRef(0);
    useEffect(() => {
        if (delta.current == 1) return; // make sure that sockets only register once
        delta.current = 1;

        func();
    }, []);
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

export function getLocal(key: string) {
    let item = localStorage.getItem(`logger-${key}`);
    if (!item) return item;
    if (item.includes(">>object")) {
        item = JSON.parse(item.split('>>object')[0]);
    }
    return item as unknown;
}

export const urlRegex = () => /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

export function replaceString(regx:RegExp, content: string, matcher: ((match: string, i:number) => JSX.Element)) {
    const matching = content.match(regx);
    if (!matching || matching?.length == 0) return content;
    return <>
        {
            matching?.map((m, i) => {
                let split = content.split(m);
                return <span key={i}>
                    {split[i]}
                    {matcher(m, i)}
                    {i == matching.length - 1 ? split[i + 1] : ""}
                </span>
            })
        }
    </>
}