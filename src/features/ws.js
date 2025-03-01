import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";

const WEB_SOCKET_URL = import.meta.env.VITE_WE_MEET_API_URL;

const onMessageHandlers = new Map()
//TODO переписать на use
export const sendWebSocketMessage = (payload) => {
    socket.send(JSON.stringify(payload))
}
export const setupOnWsMessageCallbacks = (payload = {}) => {

    Object.entries(payload).forEach(([key, ...value]) => {

        if (!onMessageHandlers.has(key)) {
            onMessageHandlers.set(key, [])
        }

        onMessageHandlers.set(key, [...onMessageHandlers.get(key), ...value.flat()])
    })

}

export  const connectToWebSocket = async () => {

    return new Promise((resolve, reject) => {

        window.socket = new WebSocket(`${WEB_SOCKET_URL}?userId=${localUserStore.userId}&meetId=${meetStore.meetId}`);

        socket.onmessage = async (event) => {
            const payload = JSON.parse(event.data);
            const {type} = payload

            if (onMessageHandlers.get(type)) {
                onMessageHandlers.get(type).forEach((cb) => {
                    cb(payload)
                })
            }

        }

        socket.onclose = () => {
            console.log('Соединение с сервером закрыто');
        };

        socket.onopen = () => {
            console.log('Соединение с сервером установлено');
            resolve()
        };


    })
};


export const closeWebSocket  = ()=>{
    window.socket?.close(3000)
}