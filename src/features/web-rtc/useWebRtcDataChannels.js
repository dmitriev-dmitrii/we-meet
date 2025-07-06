import {dataChannels} from "@/features/web-rtc/webRtcStore.js";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@vueuse/core";
import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {unref} from "vue";

const {localUserId , localUserName} =  useLocalUserStore()
export const useWebRtcDataChannels = () => {

    const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE)
    const setupDataChanelEvents = ({channel, fromUser}) => {

        const {userId, userName} = fromUser

        dataChannels[userId] = channel

        channel.onmessage = (e) => {

            const data = JSON.parse(e.data)

            webRtcEventBus.emit(data)

        }

        channel.onopen = async (e) => {

            webRtcEventBus.emit({
                type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_OPEN,
                fromUser:{
                    userId,
                    userName,
                },
            })

            sendDataChanelMessage({
                type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_MEDIA_TRACK_STATE ,
                data: {
                    video: localUserStore.video,
                    audio: localUserStore.audio
                }
            })
        }

        channel.onclose = async (e) => {

            webRtcEventBus.emit({
                type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_CLOSE,
                fromUser: {
                    userId,
                    userName,
                },
            })

        };

    }

    const sendDataChanelMessage = (payloadRaw) => {

        const payload = JSON.stringify({
            ...payloadRaw,
            fromUser: {
                userId : unref(localUserId),
                userName : unref(localUserName)
            },
        })

        Object.values(dataChannels).forEach((item) => {

            if (item?.readyState === 'open') {
                item.send(payload)
            } else {
                console.warn('sendDataChanelMessage readyState is not open')
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