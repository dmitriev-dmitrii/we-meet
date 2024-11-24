import {useWebSocket} from "@/features/useWebSocket";
import {computed, ref, unref} from "vue";

const {sendWebSocketMessage} = useWebSocket()

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const peerConnection = new RTCPeerConnection(configuration);

const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// localVideo.srcObject = localStream;

localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidate = (event) => {
    console.log('onicecandidate')

    if (event.candidate) {
        // socket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
    }
};
peerConnection.onconnectionstatechange = (e)=>{
    console.log('onconnectionstatechange', e)
}


// peerConnection.onaddstream
// peerConnection.onremovestream

peerConnection.ondatachannel = ()=>{
    console.log(' ondatachannel ')
}

peerConnection.onicecandidateerror = ()=>{
    console.log(' onicecandidateerror ')
}

peerConnection.oniceconnectionstatechange = ()=>{
    console.log(' oniceconnectionstatechange ')
}

peerConnection.onicegatheringstatechange = ()=>{
    console.log(' onicegatheringstatechange ')
}

peerConnection.onnegotiationneeded = ()=>{
    console.log('onnegotiationneeded  ')
}

peerConnection.onsignalingstatechange = ()=>{

    console.log(' onsignalingstatechange ', peerConnection.signalingState )
}


export const useWebRTC = () => {

    async function createPeerOffer() {

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        return offer
        // sendWebSocketMessage()
        // socket.send(JSON.stringify({ type: 'offer', offer }));
    }



    const  onPeerOffer = async ({data})=> {

        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));

    }
    const createPeerAnswer = async ()=> {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        // sendWebSocketMessage()
        // socket.send(JSON.stringify({ type: 'answer', answer }));
    }
    const onPeerAnswer = async ({data})=> {
        console.log(data)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    }

    const onIceCandidate = async ({data})=> {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
    }

    return {
        createPeerAnswer,
        onPeerAnswer,
        createPeerOffer,
        onPeerOffer,
        onIceCandidate,
    }
};


