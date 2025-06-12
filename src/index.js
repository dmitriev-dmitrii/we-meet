import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// import '@/css/index.css'
// import  "webrtc-adapter";
//
// import  "@/components/statusBar/status-bar.component.html";
//
// import  "@/components/appSteps/meetStep/meet-app.component.html";
// import  "@/components/appSteps/meetStep/meetChat/meet-chat.component.html";
//
// import  "@/components/appSteps/createMeetStep/create-meet-form.component.html";
// import  "@/components/appSteps/joinMeetStep/join-meet-form.component.html";
//
// import  "@/components/appSteps/meetStep/mediaStreams/local-media-stream.component.html";
// import  "@/components/appSteps/meetStep/mediaStreams/remote-media-stream.component.html";
//
// import { useWebSocket } from "./features/useWebSocket.js";
// import {useWebRtcConnections} from "./features/web-rtc/useWebRtcConnections.js";
//
// import {
//     WEB_SOCKET_EVENTS,
// } from "./constants/constants.js";
// import {meetStore} from "@/store/meetStore.js";
// import {APP_STEPS, useAppSteps} from "@/components/appSteps/useAppSteps.js";
// import {webRtcStore} from "@/store/webRtcStore.js";
// import {localUserStore} from "@/store/localUserStore.js";
//
// const {setupOnWsMessageCallbacks} = useWebSocket()
//
// const {
//     createPeerOffer,
//     confirmPeerOffer,
//     setupPeerAnswer,
//     updatePeerIceCandidate,
// } = useWebRtcConnections()
//
// const updateWsOnlineClients = ({data}) => {
//     // wsOnlineClientsDom.innerText = JSON.stringify(data.wsClientsOnline ?? [])
// }
//
// const removeUserOncloseWs =  ({data , fromUser }) => {
//     meetStore.removeUserFromMeet(fromUser.userId)
// }
//
//
// setupOnWsMessageCallbacks({
//     [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: [createPeerOffer],
//     [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
//     [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
//     [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,
//
//     [WEB_SOCKET_EVENTS.WS_CONNECTION]: updateWsOnlineClients,
//     [WEB_SOCKET_EVENTS.WS_CLOSE]: [updateWsOnlineClients,removeUserOncloseWs],
// })
//
// const {setStep} = useAppSteps();
//
// (async function ()  {
//     //start app
//     await webRtcStore.fetchIceServers()
//     await localUserStore.initLocalMediaStream()
//
//     const meetIdParams = new URLSearchParams(window.location.search).get('meetId')
//
//     if (!meetIdParams) {
//         setStep(APP_STEPS.CREATE_MEET_STEP)
//         return
//     }
//
//     meetStore.meetId = meetIdParams
//     setStep(APP_STEPS.JOIN_MEET_STEP)
// })()



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