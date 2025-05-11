import {useWebSocket} from "../useWebSocket.js";
import {peerConnections} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "./useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./useWebRtcMediaStreams.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@/features/useEventBus.js";
import {BUS_EVENTS, WEB_SOCKET_EVENTS} from "@/constants/constants.js";
import {createSharedComposable} from "@/utils/sharedComposable.js";
export const useWebRtcConnections = createSharedComposable(() => {

    const {setupDataChanelEvents} = useWebRtcDataChannels()
    const {setupMediaStreamToPeer} = useWebRtcMediaStreams()
    const {dispatchEvent} = useEventBus()
    const {sendWebSocketMessage} = useWebSocket()

    const dispatchUpdatePeerStatus = (remoteUserId) => {

        const status = peerConnections[remoteUserId]?.connectionState

        if (status) {
            dispatchEvent(BUS_EVENTS.UPDATE_PEER_CONNECTION_STATUS, {status, remoteUserId})
        }

    }

    const createPeerConnection = async (fromUser) => {
        const {
            userId: remoteUserId,
        } = fromUser

        try {

            peerConnections[remoteUserId] = new RTCPeerConnection({
                // iceServers: webRtcStore.iceServers,
                // iceTransportPolicy: "all", // Разрешить и TCP и UDP
                // iceCandidatePoolSize: 1 // Для локального тестирования
            });
            dispatchUpdatePeerStatus(remoteUserId)


            peerConnections[remoteUserId].onconnectionstatechange = onPeerConnectionStateChange.bind({
                remoteUserId
            })

            await setupMediaStreamToPeer({remoteUserId})

            return peerConnections[remoteUserId]
        } catch (e) {
            console.log('createPeerConnection err', e)
        }
    }

    function onIceCandidate(event) {
        try {

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

        } catch (e) {
            console.log('onIceCandidate err', e)
        }
    }

    function onPeerConnectionStateChange(event) {

        const {remoteUserId} = this

        dispatchUpdatePeerStatus(remoteUserId)

    }

    const sendMeOffer = async () => {
        try {
            const payload = {
                type: WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER,
                data: {}
            }

            sendWebSocketMessage(payload)
        } catch
            (e) {
            console.log('sendMeOffer err', e)

        }
    }

    const createPeerOffer = async ({fromUser}) => {
        try {


            const {
                userId: remoteUserId
            } = fromUser

            await createPeerConnection(fromUser)

            const channel = await peerConnections[remoteUserId].createDataChannel(localUserStore.userId);

            setupDataChanelEvents({fromUser, channel})

            peerConnections[remoteUserId].onicecandidate = onIceCandidate.bind({remoteUserId});

            const offer = await peerConnections[remoteUserId].createOffer()

            await peerConnections[remoteUserId].setLocalDescription(offer)

            const payload = {
                type: WEB_SOCKET_EVENTS.RTC_OFFER,
                to: remoteUserId,
                data: {offer}
            }

            sendWebSocketMessage(payload)
        } catch (e) {
            console.log('createPeerOffer err', e)
        }
    }

    const confirmPeerOffer = async ({fromUser, data}) => {
        try {
            const {
                userId: remoteUserId
            } = fromUser

            await createPeerConnection(fromUser)

            peerConnections[remoteUserId].ondatachannel = (event) => {
                const {channel} = event
                setupDataChanelEvents({fromUser, channel})
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
            console.error('confirmPeerOffer err', e)
        }

    }

    const setupPeerAnswer = async ({data, fromUser}) => {
        try {
            const {
                userId: remoteUserId
            } = fromUser

            await peerConnections[remoteUserId].setRemoteDescription(data.answer)
        } catch (e) {
            console.error('setupPeerAnswer err', e)
        }

    }

    const updatePeerIceCandidate = async ({data, fromUser}) => {
        try {
            const {
                userId: remoteUserId
            } = fromUser

            const {candidate} = data

            if (!candidate?.candidate) {
                console.warn('updatePeerIceCandidate , candidate is empty', remoteUserId)
                return
            }

            if (!peerConnections[remoteUserId]) {
                console.warn('updatePeerIceCandidate , remoteUserId is empty', remoteUserId)
            }

            await peerConnections[remoteUserId].addIceCandidate(candidate);
        } catch (e) {
            console.error('updatePeerIceCandidate err', e)
        }

    }


    const closePeerConnection = (remoteUserId) => {
        try {

            if (peerConnections[remoteUserId]) {
                peerConnections[remoteUserId].close()
                dispatchUpdatePeerStatus(remoteUserId)
            }

            delete peerConnections[remoteUserId]
        } catch (e) {
            console.error('closePeerConnection  err', e)
        }
    }

    return {
        sendMeOffer,
        updatePeerIceCandidate,
        createPeerOffer,
        confirmPeerOffer,
        setupPeerAnswer,
        closePeerConnection,
    }
})






