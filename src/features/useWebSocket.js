import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
import {createSharedComposable} from "@/utils/sharedComposable.js";

const WEB_SOCKET_URL = import.meta.env.VITE_WE_MEET_API_URL;

const onMessageHandlers = new Map()

let ws = undefined

export const useWebSocket =  createSharedComposable(() => {
    const sendWebSocketMessage = (payload) => {
        ws.send(JSON.stringify(payload))
    }

    const setupOnWsMessageCallbacks = (payload = {}) => {

        Object.entries(payload).forEach(([key, ...value]) => {

            if (!onMessageHandlers.has(key)) {
                onMessageHandlers.set(key, [])
            }

            onMessageHandlers.set(key, [...onMessageHandlers.get(key), ...value.flat()])
        })

    }


    const connectToWebSocket = async () => {

        return new Promise((resolve, reject) => {

            ws = new WebSocket(`${WEB_SOCKET_URL}?userId=${localUserStore.userId}&meetId=${meetStore.meetId}`);

            ws.onmessage = async (event) => {
                const payload = JSON.parse(event.data);
                const {type} = payload

                if (onMessageHandlers.get(type)) {
                    onMessageHandlers.get(type).forEach((cb) => {
                        cb(payload)
                    })
                }

            }

            ws.onclose = (event) => {
                console.log('ws closed ', event);
            };

            ws.onopen = (event) => {
                console.log('ws open ');
                resolve()
            };


        })
    };

    const closeWebSocket = () => {
        ws?.close(3000)
    }

    return {
        closeWebSocket,
        connectToWebSocket,
        sendWebSocketMessage,
        setupOnWsMessageCallbacks
    }
});
