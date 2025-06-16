import {mediaStreams, peerConnections} from "@/store/webRtcStore.js";
import {localUserStore} from "@/store/localUserStore.js";
import {BUS_EVENTS} from "@/constants/constants.js";
import {useEventBus} from "@/features/useEventBus.js";


export const useWebRtcMediaStreams = () => {

    const {dispatchEvent} = useEventBus()
    const setupMediaStreamToPeer = async ({remoteUserId}) => {
        await localUserStore.initLocalMediaStream()
        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => {
                peerConnections[remoteUserId].addTrack(track, localUserStore.userStreams)
            });
        }

        peerConnections[remoteUserId].ontrack = function (e) {

            mediaStreams[remoteUserId] = {
                ...mediaStreams[remoteUserId],
                ...{[e.track.kind]: e}
            }

            dispatchEvent(BUS_EVENTS.REMOTE_USER_ON_TRACK, {remoteUserId})
        }


    }

    const deleteMediaStream = (remoteUserId) => {
        delete mediaStreams[remoteUserId]
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}