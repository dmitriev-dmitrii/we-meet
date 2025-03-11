import {dataChannels} from "@/store/webRtcStore.js";
import {BUS_EVENTS} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@/features/useEventBus.js";
export const useWebRtcDataChannels = () => {

    const {dispatchEvent} = useEventBus()

    const setupDataChanelEvents = ({channel,remoteUserId}) => {

        dataChannels[remoteUserId] = channel

        channel.onmessage = (e) => {
            const data = JSON.parse(e.data)

            dispatchEvent(BUS_EVENTS.DATA_CHANEL_MESSAGE, data)

        }

        channel.onopen = async (e) => {
            dispatchEvent(BUS_EVENTS.DATA_CHANEL_OPEN, e)
        }

        channel.onclose = async (e) => {
            dispatchEvent(BUS_EVENTS.DATA_CHANEL_CLOSE, e)
        };

    }

    const sendDataChanelMessage = (payload) => {

        const data = JSON.stringify({
            ...payload,
            from: localUserStore.userId ,
            remoteUserName : localUserStore.userName
        })

        Object.values(dataChannels).forEach((item) => {

            if (item.readyState === 'open') {
                item.send(data)
            }

        })

    }

    const deleteDataChanel = (remoteUserId) => {

        if (dataChannels[remoteUserId]) {
            dataChannels[remoteUserId].close()
        }

        delete dataChannels[remoteUserId]

    }

    return {
        deleteDataChanel,
        sendDataChanelMessage,
        setupDataChanelEvents,
    }
}