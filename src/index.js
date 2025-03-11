import '@/css/index.css'
import adapter from "webrtc-adapter";

import {LocalMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/LocalMediaStream.js";
import {RemoteMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/RemoteMediaStream.js";

import {JoinMeetForm} from "@/components/AppSteps/JoinMeetForm/JoinMeetForm.js";
import {CreateMeetForm} from "@/components/AppSteps/CreateMeetForm/CreateMeetForm.js";
import {MeetApp} from "@/components/AppSteps/MeetApp/MeetApp.js";
import {MeetChat} from "@/components/AppSteps/MeetApp/MeetChat/MeetChat.js";

customElements.define('remote-media-stream', RemoteMediaStream);
customElements.define('local-media-stream', LocalMediaStream);

customElements.define('join-meet-form', JoinMeetForm);
customElements.define('create-meet-form', CreateMeetForm);
customElements.define('meet-app', MeetApp);
customElements.define('meet-chat', MeetChat);

import { useWebSocket } from "./features/useWebSocket.js";
import {useWebRtcConnections} from "./features/web-rtc/useWebRtcConnections.js";
import {useWebRtcDataChannels} from "./features/web-rtc/useWebRtcDataChannels.js";

import {
    WEB_SOCKET_EVENTS,
    DATA_CHANNELS_MESSAGE_TYPE, BUS_EVENTS,
} from "./constants/constants.js";
import {meetStore} from "@/store/meetStore.js";
import {APP_STEPS, useAppSteps} from "@/features/useAppSteps.js";
import {useEventBus} from "@/features/useEventBus.js";

const {setupOnWsMessageCallbacks} = useWebSocket()

const {
    createPeerOffer,
    confirmPeerOffer,
    setupPeerAnswer,
    updatePeerIceCandidate,
} = useWebRtcConnections()

const {
    sendDataChanelMessage,
} = useWebRtcDataChannels()

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


const {setStep} = useAppSteps();

(function ()  {

    const meetIdParams = new URLSearchParams(window.location.search).get('meetId')

    if (!meetIdParams) {
        setStep(APP_STEPS.CREATE_MEET_STEP)
        return
    }

    meetStore.meetId = meetIdParams
    setStep(APP_STEPS.JOIN_MEET_STEP)
})()


// window.onbeforeunload = function( event) {
//
//     if (meetStore.meetId) {
//         event.preventDefault();
//         event.returnValue = true;
//         return  event.returnValue;
//     }
//
// };
//
// window.onunload = function( event) {
//     if (meetStore.meetId) {
//         meetStore.leaveMeet()
//     }
// };