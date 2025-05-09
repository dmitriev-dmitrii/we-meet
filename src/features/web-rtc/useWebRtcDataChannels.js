import {dataChannels} from "@/store/webRtcStore.js";
import {BUS_EVENTS, DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@/features/useEventBus.js";
export const useWebRtcDataChannels = () => {

    const {dispatchEvent} = useEventBus()

    const setupDataChanelEvents = ( { channel , fromUser  } ) => {

        const {  userId:remoteUserId , userName: remoteUserName } = fromUser

        dataChannels[remoteUserId] = channel

        channel.onmessage = (e) => {
            const payload = JSON.parse(e.data)

            const { type } = payload

            if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE) {

                dispatchEvent( BUS_EVENTS.UPDATE_REMOTE_USER_MEDIA_TRACK_STATE,  payload)

            }

            if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE) {

                dispatchEvent( BUS_EVENTS.DATA_CHANEL_TEXT_MESSAGE,  payload )

            }

        }

        channel.onopen = async (e) => {
            dispatchEvent(BUS_EVENTS.DATA_CHANEL_OPEN, { remoteUserId  , remoteUserName })
            localUserStore.sendMediaTrackLocalState()
        }

        channel.onclose = async (e) => {
            dispatchEvent(BUS_EVENTS.DATA_CHANEL_CLOSE, { remoteUserId  , remoteUserName })
        };

    }

    const sendDataChanelMessage = (payloadRaw) => {

        const payload = JSON.stringify({
            ...payloadRaw,
            from: localUserStore.userId ,
            fromUserName : localUserStore.userName
        })

        Object.values(dataChannels).forEach((item) => {

            if (item.readyState === 'open') {
                item.send(payload)
            }

        })

    }

    const closeDataChanel = (remoteUserId) => {

        if (dataChannels[remoteUserId]) {
            dataChannels[remoteUserId].close()
        }

       dataChannels[remoteUserId] = null

    }

    return {
        closeDataChanel,
        sendDataChanelMessage,
        setupDataChanelEvents,
    }
}