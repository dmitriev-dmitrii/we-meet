import {useMeetRoom} from "@/features/useMeetRoom";
import { ref, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import {useCurrentUser} from "@/features/useCurrentUser";
import {uniqBy} from "lodash";


let peerConnection

const configuration = {}

const {initUserStream,userStream,name,userId} = useCurrentUser()
// const {roomId,meetUsers,creatorUserId } =  useMeetRoom()
const {   sendWebSocketMessage,addWebSocketMessageHandlers} = useWebSocket()

const currentMediaConnections = ref([])

export const usePeerConnection = ()=> {

    let peerConnection;
    const roomId = 123;
   async function createPeerConnection(isInitiator) {

        console.log('Создание peer-соединения, инициатор:', isInitiator);
        peerConnection = new RTCPeerConnection();
        //
        // localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // document.getElementById('localVideo').srcObject = localStream;

        unref(userStream).getTracks().forEach(item => {
            peerConnection.addTrack(item, unref(userStream));
        });

        peerConnection.ontrack = (event) => {
            console.log('Получен удаленный трек',event);
            // document.getElementById('remoteVideo').srcObject = event.streams[0];
            const [newStream] = event.streams
            const  {id} = newStream

            currentMediaConnections.value =   uniqBy( [...currentMediaConnections.value,newStream] , 'id')

        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Отправка ICE-кандидата');
                sendWebSocketMessage({
                    type: 'ice-candidate',
                    roomId,
                    candidate: event.candidate
                });
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('connection state change:', peerConnection.iceConnectionState);
        };

        peerConnection.onsignalingstatechange = () => {
            console.log('Signaling onsignalingstatechange:', peerConnection.signalingState);
        };


        if (isInitiator) {
            console.log('Создание предложения');
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => {
                    console.log('Отправка предложения');
                    sendWebSocketMessage({
                        type: 'offer',
                        roomId,
                        offer: peerConnection.localDescription
                    });
                })
                .catch(error => console.error('Ошибка создания предложения:', error));
        }
    }

    async function  handleUserConnection(data) {
        createPeerConnection(true);
    }


    async function handleOffer({offer}) {
        // Функция для обработки предложения (offer) от удаленного пира
        console.log('Получено предложение');
        if (!peerConnection) {
            createPeerConnection(false);
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Отправка ответа');
        sendWebSocketMessage({
            type: 'answer',
            roomId,
            answer: peerConnection.localDescription
        });
    }

    // Функция для обработки ответа (answer) от удаленного пира
    async function handleAnswer({answer}) {
        console.log('Получен ответ');
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    // Функция для обработки ICE-кандидата от удаленного пира
    async function handleIceCandidate({candidate}) {
        console.log('Получен ICE-кандидат');
        try {
            await peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('Ошибка добавления ICE-кандидата:', error);
        }
    }



    return {
        currentMediaConnections,
        handleIceCandidate,
        handleOffer,
        handleUserConnection,
        handleAnswer
    }
}
