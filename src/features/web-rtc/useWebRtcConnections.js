import {sendWebSocketMessage} from "../ws.js";

import {peerConnections} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "./useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./useWebRtcMediaStreams.js";

import {
    BUS_EVENTS,
    WEB_SOCKET_EVENTS
} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@/features/useEventBus.js";

const configuration = {
    // iceServers: [
    //     { urls: 'stun:stun.l.google.com:19302' },
    // ]
};

export const useWebRtcConnections = () => {

    const {setupDataChanelEvents} = useWebRtcDataChannels()
    const {setupMediaStreamToPeer} = useWebRtcMediaStreams()
    const {dispatchEvent} = useEventBus()

    const createPeerConnection = async ({remoteUserId}) => {

        try {

            peerConnections[remoteUserId] = new RTCPeerConnection(configuration);

            peerConnections[remoteUserId].oniceconnectionstatechange = onIceConnectionStateChange.bind({
                remoteUserId,
            })

            await setupMediaStreamToPeer({remoteUserId})

            return peerConnections[remoteUserId]
        } catch (e) {
            console.log('createPeerConnection err', e)
            alert(e)
        }
    }

    function onIceCandidate(event) {

        if (!event.candidate) {
            return
        }

        const payload = {
            to: this.remoteUserId,
            type: WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE,
            data: {
                pairName: this.pairName,
                candidate: event.candidate
            }
        }

        sendWebSocketMessage(payload)
    }

    function onIceConnectionStateChange(event) {

        const status = event.target.iceConnectionState
        const {remoteUserId} = this

        if (status) {
            dispatchEvent(BUS_EVENTS.UPDATE_PEER_CONNECTION_STATUS, {status, remoteUserId})
            return
        }

        console.warn('onIceConnectionStateChange', 'no event status')
    }

    const sendMeOffer = async () => {
        const payload = {
            type: WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER,
            data: {}
        }

        sendWebSocketMessage(payload)
    }

    const createPeerOffer = async ({from: remoteUserId}) => {

        // if (peerConnections[pairName] || peerConnections[buildConnectionsName(from)]) {
        //     console.warn('aborted createPeerOffer, pairName already eat :', pairName)
        //     return
        // }

        await createPeerConnection({remoteUserId})

        const channel = await peerConnections[remoteUserId].createDataChannel(localUserStore.userId);

        setupDataChanelEvents({remoteUserId, channel})

        peerConnections[remoteUserId].onicecandidate = onIceCandidate.bind({remoteUserId});

        const offer = await peerConnections[remoteUserId].createOffer()
        await peerConnections[remoteUserId].setLocalDescription(offer)

        const payload = {
            type: WEB_SOCKET_EVENTS.RTC_OFFER,
            to: remoteUserId,
            data: {offer}
        }

        sendWebSocketMessage(payload)
    }

    const confirmPeerOffer = async ({from: remoteUserId, data}) => {
        try {
            await createPeerConnection({remoteUserId})

            peerConnections[remoteUserId].ondatachannel = (event) => {
                const {channel} = event
                setupDataChanelEvents({remoteUserId, channel})
            }

            peerConnections[remoteUserId].onicecandidate = onIceCandidate.bind({remoteUserId});

            await peerConnections[remoteUserId].setRemoteDescription(data.offer)

            const answer = await peerConnections[remoteUserId].createAnswer()
            await peerConnections[remoteUserId].setLocalDescription(answer)

            const payload = {
                to: remoteUserId,
                type: WEB_SOCKET_EVENTS.RTC_ANSWER,
                data: {answer}
            }

            sendWebSocketMessage(payload)
        } catch (e) {
            console.error('confirmPeerOffer', e)
        }

    }

    const setupPeerAnswer = async ({data, from}) => {
        try {
            await peerConnections[from].setRemoteDescription(data.answer)
        } catch (e) {
            console.error('setupPeerAnswer', e)
        }

    }

    const updatePeerIceCandidate = async ({data , from: remoteUserId}) => {
        try {

            const { candidate } = data

            if (!candidate?.candidate) {
                console.warn('updatePeerIceCandidate , candidate is empty', remoteUserId)
                return
            }

            if (!peerConnections[remoteUserId]) {
                console.warn('updatePeerIceCandidate , remoteUserId is empty', remoteUserId)
            }

            await peerConnections[remoteUserId].addIceCandidate(candidate);
        } catch (e) {
            console.error('updatePeerIceCandidate', e)
        }

    }


    const deletePeerConnection = (remoteUserId) => {

        if (peerConnections[remoteUserId]) {
            peerConnections[remoteUserId].close()
        }

        delete peerConnections[remoteUserId]
    }

    return {
        sendMeOffer,
        updatePeerIceCandidate,
        createPeerOffer,
        confirmPeerOffer,
        setupPeerAnswer,
        deletePeerConnection,
    }
}







