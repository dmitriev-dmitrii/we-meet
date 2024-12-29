<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>

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

import {useWebRtc} from "@/features/useWebRtc";
import {useUserStore} from "@/store/useUserStore";

const {setupWebSocketMessageHandlers,currentWebSocketState} = useWebSocket()
const userStore = useUserStore()
const {
  updatePeerIceCandidate,
  createPeerOffer,
  confirmPeerOffer,
  setupPeerAnswer,
} = useWebRtc()
// todo server ws status indicator
// todo axios api instance
// todo chat Handlers refactor
// todo add eslint prettier airbnb

 setupWebSocketMessageHandlers({
    // [MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE]: [meetChatMessageHandle],
    // [MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET]: [userJoinMeetHandle ],
    // [MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET]: [userLeaveMeetHandle],

   'join-request' : [createPeerOffer],
   'offer': [confirmPeerOffer],
   'answer': [setupPeerAnswer],
   'ice-candidate': [updatePeerIceCandidate],

  })

</script>


