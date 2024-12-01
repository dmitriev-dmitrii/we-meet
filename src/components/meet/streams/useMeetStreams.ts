import {useUserStore} from "@/store/useUserStore";
import {useWebRTC} from "@/features/useWebRTC";
import {ref} from "vue";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";
import {useWebSocket} from "@/features/useWebSocket";


const mediaStreams = ref([])
export const useMeetStreams = () => {
    const userStore = useUserStore()
    const {peerConnection} =  useWebRTC()
    const {sendWebSocketMessage} = useWebSocket()
    const initLocalStream = async ()=> {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        stream.getTracks().forEach((track)=> {
            //@ts-ignore
             track.userId = userStore.userId /// кладем userId из метаданных
             peerConnection.addTrack(track, stream)
        });

        mediaStreams.value.push( { userId:'userStore.userId' , stream } )

        return stream
    }

    peerConnection.ontrack = (event) => {

        const stream = event.streams[0];
        //@ts-ignore
        const userId = event.track.userId; // Получаем userId из метаданных

        mediaStreams.value.push({ userId , stream })
    };

    peerConnection.onicecandidate = ({candidate}) => {
        console.log('onicecandidate')

        if (!candidate) {
            return
        }

        const payload = {

            type: MEET_WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE,
            data : {
                candidate
            }
        }

        sendWebSocketMessage(payload)
        // socket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
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

    peerConnection.onnegotiationneeded = ()=> {
        console.log('onnegotiationneeded  ')
    }

    peerConnection.onsignalingstatechange = ()=>{

        console.log(' onsignalingstatechange ', peerConnection.signalingState )
    }

    return {
        mediaStreams,
        initLocalStream,
    }
}