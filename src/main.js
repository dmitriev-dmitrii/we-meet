import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))



import {LocalMediaStream} from "./components/LocalMediaStream.js";
import {RemoteMediaStream} from "./components/RemoteMediaStream.js";

customElements.define('remote-media-stream', RemoteMediaStream);
customElements.define('local-media-stream', LocalMediaStream);

import {
    WEB_SOCKET_EVENTS,
    DATA_CHANNELS_EVENTS,
    DATA_CHANNELS_MESSAGE_TYPE,
    MEDIA_STREAMS_EVENTS
} from "./constants.js";

import {remoteMediaStreamsDomMap} from './web-rtc/useWebRtcStore.js'
import {setupOnWsMessageCallbaks} from "./ws.js";
import {useWebRtcConnections} from "./web-rtc/useWebRtcConnections.js";
import {useWebRtcDataChannels} from "./web-rtc/useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "./web-rtc/useWebRtcMediaStreams.js";

const wsOnlineClientsDom = document.getElementById('wsOnlineClientsDom');
const connectButton = document.getElementById('connectButton');
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

const {
    setupMediaStreamsCallbacks,
} = useWebRtcMediaStreams()

const printChatMessage = (message) => {
    const listItem = document.createElement('li')
    listItem.innerText = message
    webRtcChatMessages.append(listItem)
}
const onDataChanelMessage = ({ data, type, from, pairName }) => {

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_OPEN && remoteMediaStreamsDomMap.has(from)) {
        const message = `[${from}] : DATA_CHANEL_OPEN`
        const remoteStream =  remoteMediaStreamsDomMap.get(from)
        remoteStream.updateAudioStatus(data.audio)
        remoteStream.updateVideoStatus(data.video)
        printChatMessage(message)
        return
    }

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_CLOSE && remoteMediaStreamsDomMap.has(from)) {

        const message = `[${from}] : DATA_CHANEL_CLOSE`
        printChatMessage(message)

        remoteMediaStreamsDomMap.get(from).removeMediaStreamComponent()
        remoteMediaStreamsDomMap.delete(from)
        return
    }

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE && remoteMediaStreamsDomMap.has(from)) {

        remoteMediaStreamsDomMap.get(from).updateVideoStatus(data.video)
        remoteMediaStreamsDomMap.get(from).updateAudioStatus(data.audio)
        return;
    }

    if (type === DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE) {
        const message = `[${from}] : ${data.text}`
        printChatMessage(message)
    }

}
const updateWsOnlineClients = ({data}) => {
    wsOnlineClientsDom.innerText = JSON.stringify(data.wsClientsOnline ?? [])
}

const onMediaStreamTrack = (event, {pairName, remoteUserId, remoteUserName}) => {

    const {streams} = event

    if (remoteMediaStreamsDomMap.has(remoteUserId)) {
        return
    }

    remoteMediaStreamsDomMap.set(remoteUserId, new RemoteMediaStream({ remoteUserName, remoteUserId, streams , pairName }))
    webRtcMediaStreams.append(remoteMediaStreamsDomMap.get(remoteUserId))
}

setupOnWsMessageCallbaks({
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

setupMediaStreamsCallbacks({
    [MEDIA_STREAMS_EVENTS.MEDIA_STREAM_ON_TRACK]: onMediaStreamTrack,
})

connectButton.onclick = async () => {
    await sendMeOffer()
}

webRtcChatForm.addEventListener('submit', (event) => {
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