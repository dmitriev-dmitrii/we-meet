// @ts-nocheck
import {useWebSocket} from "@/features/useWebSocket";
import {computed, ref, unref} from "vue";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const peerConnection = new RTCPeerConnection(configuration);

export const useWebRTC = () => {
    const {sendWebSocketMessage} = useWebSocket()
    async function createPeerOffer() {

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        return offer
        // sendWebSocketMessage()
        // socket.send(JSON.stringify({ type: 'offer', offer }));
    }

    const  onPeerOffer = async ({rtcOffer})=> {

        await peerConnection.setRemoteDescription(new RTCSessionDescription(rtcOffer));

    }
    const createPeerAnswer = async ()=> {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const payload = {
           type: MEET_WEB_SOCKET_EVENTS.RTC_ANSWER,
           data: {
                answer
            }
        }

        sendWebSocketMessage(payload)
        console.log('createPeerAnswer', payload)
        // socket.send(JSON.stringify({ type: 'answer', answer }));
    }
    const onPeerAnswer = async ({data})=> {
        console.log('onPeerAnswer', data)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    }

    const onIceCandidate = async ({data})=> {
        console.log('onIceCandidate' , data)
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }

    return {
        peerConnection,
        createPeerAnswer,
        onPeerAnswer,
        createPeerOffer,
        onPeerOffer,
        onIceCandidate,
    }
};


