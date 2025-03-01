import {sendWebSocketMessage} from "../ws.js";

import {peerConnections} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "./useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./useWebRtcMediaStreams.js";

import {
    DISCONNECTED_STATE_STATUSES,
    PEER_CONNECTIONS_STATE_STATUSES,
    WEB_SOCKET_EVENTS
} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
const buildConnectionsName = (remoteUserId, isHostPeer = false) => {
    // пусть имя хоста будет первым - проще для дебагинга
    return isHostPeer ? `[${localUserStore.userId}][${remoteUserId}]` : `[${remoteUserId}][${localUserStore.userId}]`
}

const configuration = {
    // iceServers: [
    //     { urls: 'stun:stun.l.google.com:19302' },
    // ]
};

export const useWebRtcConnections = () => {

    const {setupDataChanelEvents} = useWebRtcDataChannels()
    const {setupMediaStreamToPeer} = useWebRtcMediaStreams()

    const createPeerConnection = async ({pairName, isHost, remoteUserId}) => {

        peerConnections[pairName] = new RTCPeerConnection(configuration);

        peerConnections[pairName].oniceconnectionstatechange = onIceConnectionStateChange.bind({remoteUserId, pairName})

        setupMediaStreamToPeer({pairName, remoteUserId})

        if (isHost) {
            const channel = await peerConnections[pairName].createDataChannel(pairName);

            setupDataChanelEvents({pairName, channel})
        } else {
            peerConnections[pairName].ondatachannel = (event) => {
                const {channel} = event

                setupDataChanelEvents({pairName, channel})
            }
        }

        return peerConnections[pairName]
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
        console.log(status)
        const { remoteUserId, pairName } = this

        if (status === PEER_CONNECTIONS_STATE_STATUSES.CONNECTED) {
            meetStore.appendUserToMeet({ remoteUserId, pairName })
            return
        }

        if (DISCONNECTED_STATE_STATUSES.includes(status)) {
            meetStore.removeUserFromMeet({ remoteUserId, pairName })
        }

    }

    const sendMeOffer = async () => {
        const payload = {
            type: WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER,
            data: {}
        }

        sendWebSocketMessage(payload)
    }


    const createPeerOffer = async ({from}) => {

        const pairName = buildConnectionsName(from, true)
        const isHost = true

        if (peerConnections[pairName] || peerConnections[buildConnectionsName(from)]) {
            console.warn('aborted createPeerOffer, pairName already eat :', pairName)
            return
        }

        const hostPeerConnection = await createPeerConnection({remoteUserId: from, pairName, isHost})

        hostPeerConnection.onicecandidate = onIceCandidate.bind({remoteUserId: from, pairName});

        const offer = await hostPeerConnection.createOffer()
        await hostPeerConnection.setLocalDescription(offer)

        const payload = {
            type: WEB_SOCKET_EVENTS.RTC_OFFER,
            to: from,
            data: {offer}
        }

        sendWebSocketMessage(payload)
    }

    const confirmPeerOffer = async ({from, data}) => {

        const isHost = false
        const pairName = buildConnectionsName(from, isHost)

        const clientPeerConnection = await createPeerConnection({remoteUserId: from, pairName, isHost})

        clientPeerConnection.onicecandidate = onIceCandidate.bind({remoteUserId: from, pairName});

        await clientPeerConnection.setRemoteDescription(data.offer)

        const answer = await clientPeerConnection.createAnswer()
        await clientPeerConnection.setLocalDescription(answer)

        const payload = {
            to: from,
            type: WEB_SOCKET_EVENTS.RTC_ANSWER,
            data: {answer}
        }

        sendWebSocketMessage(payload)
    }

    const setupPeerAnswer = async ({data, from}) => {
        const pairName = buildConnectionsName(from, true)
        await peerConnections[pairName].setRemoteDescription(data.answer)
    }

    const updatePeerIceCandidate = async ({data}) => {
        try {

            const {pairName, candidate} = data

            if (!candidate?.candidate) {
                console.warn('updatePeerIceCandidate , candidate is empty', pairName)
                return
            }

            if (!peerConnections[pairName]) {
                console.warn('updatePeerIceCandidate , pairName is empty', pairName)
            }

            await peerConnections[pairName].addIceCandidate(candidate);
        } catch (e) {
            console.error('updatePeerIceCandidate', e)
        }

    }


    const deletePeerConnection = (pairName) => {

        if (peerConnections[pairName]) {
            peerConnections[pairName].close()
        }

        delete peerConnections[pairName]
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







