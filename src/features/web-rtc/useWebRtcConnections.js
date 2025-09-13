import {useWebSocket} from "../useWebSocket.js";
import {useWebRtcStore} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "./useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./useWebRtcMediaStreams.js";
import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {WEB_SOCKET_EVENTS} from "@/constants/web-socket.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {useEventBus} from "@vueuse/core";
import {unref} from "vue";

const {peerConnections, iceServers} = useWebRtcStore()
const {setupDataChanelEvents} = useWebRtcDataChannels();
const {setupMediaStreamToPeer} = useWebRtcMediaStreams();
const {sendWebSocketMessage} = useWebSocket();

const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE);


const {localUserId} = useLocalUserStore()
export const useWebRtcConnections = () => {

    const dispatchUpdatePeerStatus = ({userId, userName}) => {

        const peerStatus = peerConnections[userId]?.connectionState

        if (peerStatus) {
            webRtcEventBus.emit({
                type: WEB_RTC_EVENT_BUS_TYPES.PEER_UPDATE_STATUS,
                data: {
                    peerStatus
                },
                fromUser: {
                    userId,
                    userName
                }

            })
        }

    }
    const createPeerConnection = async (fromUser) => {

        const {
            userId,
            userName
        } = fromUser

        try {

            peerConnections[userId] = new RTCPeerConnection({
                iceServers: unref(iceServers)
            });

            dispatchUpdatePeerStatus({userId, userName})

            peerConnections[userId].onconnectionstatechange = onPeerConnectionStateChange.bind({
                userId,
                userName
            })

            await setupMediaStreamToPeer({userId})

            return peerConnections[userId]
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
                to: this.userId,
                type: WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE,
                data: {
                    candidate: event.candidate
                }
            }

            sendWebSocketMessage(payload)

        } catch (e) {
            console.log('onIceCandidate err', e)
        }
    }

    function onPeerConnectionStateChange(event) {

        const {userId, userName} = this

        dispatchUpdatePeerStatus({userId, userName})

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
                userId,
                userName
            } = fromUser

            await createPeerConnection(fromUser)

            const channel = await peerConnections[userId].createDataChannel(unref(localUserId));

            setupDataChanelEvents({fromUser, channel})

            peerConnections[userId].onicecandidate = onIceCandidate.bind(fromUser);

            const offer = await peerConnections[userId].createOffer()

            await peerConnections[userId].setLocalDescription(offer)

            const payload = {
                type: WEB_SOCKET_EVENTS.RTC_OFFER,
                to: userId,
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
                userId
            } = fromUser

            await createPeerConnection(fromUser)

            peerConnections[userId].ondatachannel = (event) => {
                const {channel} = event
                setupDataChanelEvents({fromUser, channel})
            }

            peerConnections[userId].onicecandidate = onIceCandidate.bind({userId});

            await peerConnections[userId].setRemoteDescription(data.offer)

            const answer = await peerConnections[userId].createAnswer()

            await peerConnections[userId].setLocalDescription(answer)

            const payload = {
                to: userId,
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
                userId
            } = fromUser

            await peerConnections[userId].setRemoteDescription(data.answer)
        } catch (e) {
            console.error('setupPeerAnswer err', e)
        }

    }

    const updatePeerIceCandidate = async ({data, fromUser}) => {
        try {
            const {
                userId
            } = fromUser

            const {candidate} = data

            if (!candidate?.candidate) {
                console.warn('updatePeerIceCandidate , candidate is empty', userId)
                return
            }

            if (!peerConnections[userId]) {
                console.warn('updatePeerIceCandidate , remoteUserId is empty', userId)
            }

            await peerConnections[userId].addIceCandidate(candidate);
        } catch (e) {
            console.error('updatePeerIceCandidate err', e)
        }

    }


    const closePeerConnection = (userId) => {
        try {

            if (peerConnections[userId]) {
                peerConnections[userId].close()
            }

            delete peerConnections[userId]
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
}






