import {BUS_EVENTS} from "@/constants/constants.js";

class EventBus extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('event-bus', EventBus);

const eventBusElement = new EventBus()

const CALLBACKS_MAP = new Map(Object.values(BUS_EVENTS).reduce((acc, eventKeyValue) => {

    acc.push([eventKeyValue, new Set()])

    return acc
}, []))


export const useEventBus = () => {
    const dispatchEvent = (eventKey, payload = {}) => {

        if (!Object.values(BUS_EVENTS).includes(eventKey)) {
            throw new Error('event must be registered in BUS_EVENTS')
        }

        const event = new CustomEvent(eventKey, {detail: payload});

        eventBusElement.dispatchEvent(event)
    }

    const eventBusHandle = ({detail = {}, type: eventKey }) => {


        if (!CALLBACKS_MAP.get(eventKey).size) {
            return
        }

        const callbacksSet = CALLBACKS_MAP.get(eventKey)

        Array.from( callbacksSet ).forEach((callback) => {
            callback(detail)
        })

    }

    const listenEvent = (eventKey, callback) => {

        if (!Object.values(BUS_EVENTS).includes(eventKey)) {
            throw new Error('event must be registered in BUS_EVENTS')
        }

        CALLBACKS_MAP.get(eventKey).add(callback)

        eventBusElement.addEventListener(eventKey, eventBusHandle)
    }


    return {
        dispatchEvent, listenEvent,
    };
};