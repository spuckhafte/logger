import { useEffect, useRef } from "react";

export function incomingSockets(register: (() => void)) {
    const delta = useRef(0);
    useEffect(() => {
        if (delta.current == 1) return; // make sure that sockets only register once
        delta.current = 1;

        register();
    }, []);
}