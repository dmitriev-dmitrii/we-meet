import {useMeetRoom} from "@/features/useMeetRoom";
import {ref, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import {useCurrentUser} from "@/features/useCurrentUser";

let localStream:any;
let peerConnection:any;
let remoteStream:any;

const configuration = {}

const {initUserStream,name,userId} = useCurrentUser()
const {roomId,meetUsers,creatorUserId } =  useMeetRoom()
const {   sendWebSocketMessage,addWebSocketMessageHandlers} = useWebSocket()



export const usePeerConnection = ()=> {

   async function  createPeerConnection(  ) {
        console.log('Creating peer connection, ');

        peerConnection = new RTCPeerConnection(configuration);

        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }


        peerConnection.ontrack = (event) => {
            console.log('поключен видеострим с другого браузера');

            //@ts-ignore
            // document.getElementById('remoteVideo').srcObject = event.streams[0];
            remoteStream = event.streams[0]


            // const video = document.createElement("video");

            // meetUsers.value.propertyIsEnumerable()
        };

        //@ts-ignore
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Sending ICE candidate');

                 sendWebSocketMessage({
                    type: 'ice-candidate',
                    roomId,
                    candidate: event.candidate
                });
            }
        };



        if ( unref(name) === 'chrome' ) {
            console.log('Creating offer');
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => {
                    console.log('Sending offer');
                     sendWebSocketMessage({
                        type: 'offer',
                        roomId:unref(roomId),
                        offer: peerConnection.localDescription
                    });
                })
                .catch(error => console.error('Error creating offer:', error));
        }
    }

    async function handleOffer(offer) {
        console.log('Received offer');
        if (!peerConnection) {
           await createPeerConnection(false);
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Sending answer');



         sendWebSocketMessage({
            type: 'answer',
            roomId:unref(roomId),
            answer: peerConnection.localDescription
        });
    }

    async function handleAnswer({answer}) {
        console.log('Received answer');
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async function handleIceCandidate({candidate}) {

        try {
            await peerConnection.addIceCandidate(candidate);
            console.log(' handleIceCandidate Received ICE candidate');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }
    const userConnectedHandle = ( data ) => {

        console.log('userConnectedHandle', data )
        const { userId, name  } = data

        creatorUserId.value = data.creatorUserId

        meetUsers.value.push({userId,name})

        // createPeerConnection()
    };

const events = [
    {
        type: 'user-connected',
        callback: userConnectedHandle
    },
    {
        type: 'offer',
        callback: handleOffer
    },
    {
        type: 'answer',
        callback: handleAnswer
    },
    {
        type: 'ice-candidate',
        callback: handleIceCandidate
    }
]
// @ts-ignore
addWebSocketMessageHandlers(events)

    return {
        createPeerConnection
    }
}
