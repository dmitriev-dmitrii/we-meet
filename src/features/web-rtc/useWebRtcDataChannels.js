import {dataChannels} from "@/store/webRtcStore.js";
import {DATA_CHANNELS_EVENTS, DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";

const dataChannelsCallbacksMap = new Map();
// TODO придумать как не дублировать код с евентами
export const useWebRtcDataChannels = () => {
    const setupDataChannelCallbacks = (callbacksPayload = {}) => {

        Object.entries(callbacksPayload).forEach(([key, ...value]) => {

            if (!dataChannelsCallbacksMap.has(key)) {
                dataChannelsCallbacksMap.set(key, [])
            }

            dataChannelsCallbacksMap.set(key, [...dataChannelsCallbacksMap.get(key), ...value.flat()])
        })

    }

    const setupDataChanelEvents = ({channel,remoteUserId}) => {

        dataChannels[remoteUserId] = channel

        channel.onmessage = async (e) => {


            if (!dataChannelsCallbacksMap.has(DATA_CHANNELS_EVENTS.DATA_CHANEL_ON_MESSAGE)) {
                return
            }

            const data = JSON.parse(e.data)

            dataChannelsCallbacksMap.get(DATA_CHANNELS_EVENTS.DATA_CHANEL_ON_MESSAGE).forEach((cb) => {
                cb(data, {remoteUserId})
            })

        }

        channel.onopen = async (e) => {

        }

        channel.onclose = async (e) => {

        };

    }

    const sendDataChanelMessage = (payload) => {

        Object.values(dataChannels).forEach((item) => {

            const data = JSON.stringify({...payload, from: localUserStore.userId})

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
        setupDataChannelCallbacks
    }
}