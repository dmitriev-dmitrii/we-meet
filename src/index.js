import '@/css/index.css'
import adapter from "webrtc-adapter";
import {LocalMediaStream} from "@/components/mediaStreams/LocalMediaStream.js";
import {RemoteMediaStream} from "@/components/mediaStreams/RemoteMediaStream.js";


customElements.define('remote-media-stream', RemoteMediaStream);
customElements.define('local-media-stream', LocalMediaStream);


import {
    WEB_SOCKET_EVENTS,
    DATA_CHANNELS_EVENTS,
    DATA_CHANNELS_MESSAGE_TYPE,
} from "./constants/constants.js";




import {mediaStreams, remoteMediaStreamsDomMap} from './store/webRtcStore.js'
import {connectToWebSocket, setupOnWsMessageCallbacks} from "./features/ws/ws.js";
import {useWebRtcConnections} from "./features/web-rtc/useWebRtcConnections.js";
import {useWebRtcDataChannels} from "./features/web-rtc/useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./features/web-rtc/useWebRtcMediaStreams.js";
import {meetStore} from "@/store/meetStore.js";
import {localUserStore} from "@/store/localUserStore.js";

const meetForm = document.getElementById('meetForm')

const webRtcChatForm = document.getElementById('webRtcChatForm');
const webRtcChatInput = document.getElementById('webRtcChatInput');
const webRtcChatMessages = document.getElementById('webRtcChatMessages');
const webRtcMediaStreams = document.getElementById('webRtcMediaStreams');


const {
    sendMeOffer,
    createPeerOffer,
    confirmPeerOffer,
    setupPeerAnswer,
    updatePeerIceCandidate,

} = useWebRtcConnections()

const {
    sendDataChanelMessage,
    setupDataChannelCallbacks,

} = useWebRtcDataChannels()

const printChatMessage = (message) => {
    const listItem = document.createElement('li')
    listItem.innerText = message
    webRtcChatMessages.append(listItem)
}
const onDataChanelMessage = ({ data, type, from, pairName , }) => {

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE && remoteMediaStreamsDomMap.has(from)) {

        remoteMediaStreamsDomMap.get(from).updateVideoStatus(data.video)
        remoteMediaStreamsDomMap.get(from).updateAudioStatus(data.audio)
        return;
    }

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE) {
        const message = `[${from}] : ${data.text}`
        printChatMessage(message)
    }

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE) {
        const message = `[${from}] : ${data.text}`
        printChatMessage(message)
    }
}
const updateWsOnlineClients = ({data}) => {
    // wsOnlineClientsDom.innerText = JSON.stringify(data.wsClientsOnline ?? [])
}

setupOnWsMessageCallbacks({
    [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: [createPeerOffer],
    [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
    [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
    [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,

    [WEB_SOCKET_EVENTS.WS_CONNECTION]: updateWsOnlineClients,
    [WEB_SOCKET_EVENTS.WS_CLOSE]: updateWsOnlineClients,
})

setupDataChannelCallbacks({
    [DATA_CHANNELS_EVENTS.DATA_CHANEL_ON_MESSAGE]: onDataChanelMessage,
})


meetForm.onsubmit = async (e) => {
    e.preventDefault()

    try {

    await localUserStore.auth()

    meetStore.meetId ? await  meetStore.sendJoinMeetRequest()  : await meetStore.createMeet()
    await  connectToWebSocket()
    await sendMeOffer()

    }
    catch(e) {
        console.log(e)
        alert( e.status +' '+ e.message )
    }
}

webRtcChatForm.addEventListener('submit', (event) => {
    // TODO в компонент
    try {

        event.preventDefault();

        if (!webRtcChatInput.value) {
            return
        }

        const payload = {
            type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE,
            data: {
                text: webRtcChatInput.value,
            }
        }

        sendDataChanelMessage(payload)

        printChatMessage(`[me] : ${webRtcChatInput.value}`)

        webRtcChatInput.value = '';
    } catch (e) {

    }
});


// window.onbeforeunload = function( event) {
//
//     if (meetStore.meetId) {
//         event.preventDefault();
//         event.returnValue = true;
//         return  event.returnValue;
//     }
//
//
// };
//
window.onunload = function( event) {
    if (meetStore.meetId) {
        meetStore.leaveMeet()
    }
};