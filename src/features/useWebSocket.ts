import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";


const WEB_SOCKET_URL = import.meta.env.PROD ? `wss://${window.location.host}` : 'ws://localhost:3000';

const webSocketQueue = [];
const webSocketMessageHandlersMap:Map< MEET_WEB_SOCKET_EVENTS , Set<Function>> = new Map();

const ws = new WebSocket(WEB_SOCKET_URL);
// TODO reconnect strategy
export const useWebSocket = ()=> {
    const   setupWebSocketMessageHandlers = ( eventsMap: Partial<Record<MEET_WEB_SOCKET_EVENTS, [Function]>>) => {

        if (!Object.keys(eventsMap).length) {
            return
        }

        for (const [type, callbacksArr] of Object.entries(eventsMap)) {

           webSocketMessageHandlersMap.set( type as MEET_WEB_SOCKET_EVENTS, new Set( callbacksArr ) )

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

        if (!type && !webSocketMessageHandlersMap.has(type)) {
            console.warn('onSocketMessage , empty callbacks for event type' , `"${type}"` )
            return
        }

        //map[type] =>  set => [cb] = promises
        const callbacksSet = webSocketMessageHandlersMap.get(type);

        if (!callbacksSet) {
            console.warn(`No handlers found for event type "${type}"`);
            return; 
        }

        try {

        const callbacksPromises = Array.from(callbacksSet).map((callback) => {
            return callback(payload);
        });

        await Promise.all( callbacksPromises )

        }
        catch (e) {
            console.log(`error of ws handle, message type :"${type}", err:` ,e )
        }

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