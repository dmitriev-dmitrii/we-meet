import {ref, unref} from "vue";

const WEB_SOCKET_URL = "ws://localhost:7000";
// const WEB_SOCKET_URL = `ws://${window.location.host}`

let ws = new WebSocket(WEB_SOCKET_URL);

const webSocketQueue = [];
const webSocketMessageHandlersMap = new Map();
export const useWebSocket = ()=> {
  const   addWebSocketMessageHandlers = (events = [])=> {

        events.forEach(({type,callback})=> {
            if ( webSocketMessageHandlersMap.has(type)) {
                console.warn(`webSocketMessageHandlersMap : replaced event callback for type: ${type}`)
            }

            webSocketMessageHandlersMap.set(type,callback)
        })
    }

    const onSocketConnected = ()=> {
        console.log('WebSocket connected');
    }

    const onSocketMessage = ({data}) => {

            const payload = JSON.parse(data);

            const {type} =  payload

        if (!webSocketMessageHandlersMap.has(type)) {
          console.error('onSocketMessage , empty callback for type' , type )
          return
        }

        const callback =  webSocketMessageHandlersMap.get(type)

        callback(payload)

    };


        const onSocketError = (error) => {
            console.error('WebSocket error:', error);
        };


   const onSocketClose = (event) => {
       console.log('WebSocket Closed', event );
   };

    const connectWebSocket =  () => {

        ws = new WebSocket(WEB_SOCKET_URL);

        ws.onopen = onSocketConnected

        ws.onmessage = onSocketMessage

        ws.onerror = onSocketError

        ws.onclose = onSocketClose
    }

    function sendWebSocketMessage(payload) {

        if (ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket state is not OPEN ')
            // webSocketQueue.push(payload)
            setTimeout(()=> {
                sendWebSocketMessage(payload)
            }, 500 )
            return
        }

        ws.send(JSON.stringify(payload));
    }

    return {
        connectWebSocket,
        addWebSocketMessageHandlers,
        sendWebSocketMessage
    }
}