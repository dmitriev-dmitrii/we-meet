const WEB_SOCKET_URL = import.meta.env.PROD ? `wss://${window.location.host}` : 'ws://localhost:3000';

const webSocketQueue = [];
const webSocketMessageHandlersMap = new Map();
const ws = new WebSocket(WEB_SOCKET_URL);

export const useWebSocket = ()=> {
    const   addWebSocketMessageHandlers = (eventsMap = {})=> {

        for (const [type, callback] of Object.entries(eventsMap)) {

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


    ws.onmessage =  (event) => {
        const {data} = event
        //@ts-ignore
        const payload = JSON.parse(data);

        const {type} =  payload

        if (!webSocketMessageHandlersMap.has(type)) {
            console.warn('onSocketMessage , empty callback for event ' , `"${type}"` )
            return
        }

        const callback =  webSocketMessageHandlersMap.get(type)

        callback(payload)

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

    return {
        addWebSocketMessageHandlers,
        sendWebSocketMessage
    }
}