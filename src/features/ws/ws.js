import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";

const WEB_SOCKET_URL = import.meta.env.VITE_WE_MEET_API_URL;

// const connectToWs = ()=> {
//
// }

window.socket = new WebSocket(`${WEB_SOCKET_URL}?userId=${localUserStore.userId}&meetId=${meetStore.meetId}`);

const onMessageHandlers = new Map()

socket.onopen = () => {
    console.log('Соединение с сервером установлено');
};

socket.onclose = () => {
    console.log('Соединение с сервером закрыто');
};

socket.onmessage = async (event) => {
    const payload = JSON.parse(event.data);
    const {type} = payload

    if (onMessageHandlers.get(type)) {
        onMessageHandlers.get(type).forEach((cb) => {
            cb(payload)
        })
    }

}

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



