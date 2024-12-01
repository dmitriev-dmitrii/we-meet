<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <div>isAuth : {{userStore.isAuth}} </div>

        <div>currentWebSocketState : {{currentWebSocketState}} </div>

      </nav>
  </header>
  <main>
    <RouterView />
  </main>

</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {useWebSocket} from "@/features/useWebSocket";

import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";

import {watch} from "vue";
import {useWebRTC} from "@/features/useWebRTC";
import {useMeetChat} from "@/components/meet/chat/useMeetChat";
import {useUserStore} from "@/store/useUserStore";
const {meetChatMessageHandle,userJoinMeetHandle,userLeaveMeetHandle} = useMeetChat();
const {setupWebSocketMessageHandlers,currentWebSocketState} = useWebSocket()
const userStore = useUserStore()
const {
  createPeerAnswer,
  onPeerAnswer,
  createPeerOffer,
  onPeerOffer,
  onIceCandidate,
} = useWebRTC()
// todo server ws status indicator
// todo axios api instance
// todo chat Handlers refactor
// todo add eslint prettier airbnb

 setupWebSocketMessageHandlers({
    [MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE]: [meetChatMessageHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET]: [userJoinMeetHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET]: [userLeaveMeetHandle],

   // [MEET_WEB_SOCKET_EVENTS.RTC_OFFER]: [onPeerOffer ,createPeerAnswer],
   [MEET_WEB_SOCKET_EVENTS.RTC_ANSWER]: [onPeerAnswer],
   [MEET_WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: [onIceCandidate],
  })



</script>


