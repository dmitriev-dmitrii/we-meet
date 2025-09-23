import {useLocalUserStore} from "@/store/localUserStore.js";

const WEB_SOCKET_URL = import.meta.env.VITE_WE_MEET_WS_URL;

const onMessageHandlers = new Map()

let ws = undefined
const {          setLocalUserIsConnected} = useLocalUserStore()
export const useWebSocket =    () => {
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


    const connectToWebSocket = async ({ userId , meetId }) => {
    return new Promise((resolve, reject) => {

            ws = new WebSocket(`${WEB_SOCKET_URL}/api/ws/?userId=${userId}&meetId=${meetId}`);

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
                setLocalUserIsConnected(false)
                console.log('ws closed ', event);
            };

            ws.onopen = (event) => {
                console.log('ws open ');
                setLocalUserIsConnected(true)
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
}
