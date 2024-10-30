

const WEB_SOCKET_URL = import.meta.env.PROD ? `wss://${window.location.host}` : 'ws://localhost:3000';

const webSocketQueue = [];
const webSocketMessageHandlersMap = new Map();

const ws = new WebSocket(WEB_SOCKET_URL);
// TODO reconnect strategy
export const useWebSocket = ()=> {
    const   setupWebSocketMessageHandlers = (eventsMap = {})=> {
        // TODO add many Handlers to 1 event

        for (const [type, callback] of Object.entries(eventsMap)) {
            console.log(type)
            if ( webSocketMessageHandlersMap.has(type)) {
                console.warn(`webSocketMessageHandlersMap : replaced event callback for type: ${type}`)
            }

            if ( type && callback ) {
                webSocketMessageHandlersMap.set(type,callback)
            }

        }
    }

    function sendWebSocketMessage(payload:any) {
        // TODO сделать интерфейс payload
        if (ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket state is not OPEN ')
            // webSocketQueue.push(payload)
            // TODO пушить  очередь на отправку
            setTimeout(()=> {
                sendWebSocketMessage(payload)
            }, 500 )
            return
        }

        ws.send(JSON.stringify(payload));
    }


    ws.onmessage = async (event) => {
        const {data} = event
        //@ts-ignore
        const payload = JSON.parse(data);
        // console.log(payload)
        const {type} =  payload

        if (!webSocketMessageHandlersMap.has(type)) {
            console.warn('onSocketMessage , empty callback for event ' , `"${type}"` )
            return
        }

        const callback =  webSocketMessageHandlersMap.get(type)

        await callback(payload)

    };

    ws.onopen = (event)=> {
        console.log('WebSocket onopen');
        // TODO читать очередь на отправку
    }

    ws.onclose = (event) => {
        console.log('WebSocket Closed', event );
    };

    ws.onerror =  (error:any) => {
        console.error('WebSocket error:', error);
    };

    // const connectToWebSocket =  () => {
    //     ws =  new WebSocket(WEB_SOCKET_URL);
    // }

    return {
        setupWebSocketMessageHandlers,
        sendWebSocketMessage
    }
}