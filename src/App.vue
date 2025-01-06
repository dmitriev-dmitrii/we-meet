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
import {useWebRtc} from "@/features/useWebRtc";
import {useUserStore} from "@/store/useUserStore";
import {WEB_SOCKET_EVENTS} from "@/constatnts/WebSocketEvents";

const {setupWebSocketMessageHandlers} = useWebSocket()
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
   [WEB_SOCKET_EVENTS.MEET_JOIN_REQUEST] : [createPeerOffer],

   [WEB_SOCKET_EVENTS.RTC_OFFER]: [confirmPeerOffer],
   [WEB_SOCKET_EVENTS.RTC_ANSWER]: [setupPeerAnswer],
   [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: [updatePeerIceCandidate],

  })

</script>


