<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>
  <main >
    <RouterView />
  </main>

</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {useWebSocket} from "@/features/useWebSocket";
import {useCurrentUser} from "@/features/useCurrentUser";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";
import {useMeet} from "@/features/useMeet";
const {meetChatMessageHandle,userJoinMeetHandle,userLeaveMeetHandle} = useMeet();
const {setupWebSocketMessageHandlers} = useWebSocket()


 setupWebSocketMessageHandlers({
    [MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE]: [meetChatMessageHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET]: [userJoinMeetHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET]: [userLeaveMeetHandle],
  })


</script>


