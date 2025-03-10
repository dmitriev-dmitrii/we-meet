import {mediaStreams, peerConnections} from "@/store/webRtcStore.js";
import {localUserStore} from "@/store/localUserStore.js";
export const useWebRtcMediaStreams = () => {
    const setupMediaStreamToPeer = ({pairName, remoteUserId}) => {

        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => {
                peerConnections[pairName].addTrack(track, localUserStore.userStreams)
            });
        }

        peerConnections[pairName].ontrack = function (e) {

            mediaStreams[remoteUserId] =  {
                ...mediaStreams[remoteUserId],
                ...{[e.track.kind]: e}
            }
        }
    }

    const deleteMediaStream = (remoteUserId) => {
        delete  mediaStreams[remoteUserId]
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}