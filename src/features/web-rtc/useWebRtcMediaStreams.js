import {mediaStreams, peerConnections} from "@/store/webRtcStore.js";
import {localUserStore} from "@/store/localUserStore.js";

export const useWebRtcMediaStreams = () => {
    const setupMediaStreamToPeer = ({pairName, remoteUserId}) => {

        if (localUserStore.userStreams?.active) {
            localUserStore.userStreams.getTracks().forEach(track => peerConnections[pairName].addTrack(track, localUserStore.userStreams));
        }

        peerConnections[pairName].ontrack = function (e) {

            const streamPayload = {
                ...mediaStreams.get(remoteUserId),
                ...{[e.track.kind]: e}
            }

            mediaStreams.set(remoteUserId, streamPayload)
        }
    }

    const deleteMediaStream = (remoteUserId) => {

        if (mediaStreams.has(remoteUserId)) {
            // TODO  надо ли останавилвать медиа потоки
            mediaStreams.get(remoteUserId).forEach((stream) => {
                stream.getTracks().forEach((track) => {
                    track.stop()
                })
            })
        }

        mediaStreams.delete(remoteUserId)
    }

    return {
        deleteMediaStream,
        setupMediaStreamToPeer,
    }
}