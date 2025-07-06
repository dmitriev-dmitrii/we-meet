import {mediaStreams, peerConnections} from "@/features/web-rtc/webRtcStore.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@vueuse/core";
import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";

export const useWebRtcMediaStreams = () => {
    const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE)
    const setupMediaStreamToPeer = async ({userId, userName}) => {

        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => {
                peerConnections[userId].addTrack(track, localUserStore.userStreams)
            });
        }

        peerConnections[userId].ontrack = function (e) {

            mediaStreams[userId] = {
                ...mediaStreams[userId],
                ...{[e.track.kind]: e}
            }

            webRtcEventBus.emit({
                type: WEB_RTC_EVENT_BUS_TYPES.PEER_REMOTE_USER_ON_TRACK,
                fromUser: { userId, userName },
                data: {
                    mediaTrackKind: e.track.kind
                }
            })
        }
    }

    const deleteMediaStream = (userId) => {
        delete mediaStreams[userId]
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}