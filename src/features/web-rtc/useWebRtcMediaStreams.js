import {mediaStreams, peerConnections} from "@/store/webRtcStore.js";
import {localUserStore} from "@/store/localUserStore.js";

export const useWebRtcMediaStreams = () => {
    const setupMediaStreamToPeer = ({pairName, remoteUserId}) => {

        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => peerConnections[pairName].addTrack(track, localUserStore.userStreams));
        }

        peerConnections[pairName].ontrack = function (e) {
            mediaStreams[remoteUserId] = e.streams
        }
    }

    const deleteMediaStream = (remoteUserId) => {

        if (mediaStreams[remoteUserId]) {
            mediaStreams[remoteUserId].forEach((stream) => {
                stream.getTracks().forEach((track) => {
                    track.stop()
                })
            })
        }


        delete mediaStreams[remoteUserId]

    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}