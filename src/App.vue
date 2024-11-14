<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <div>currentWebSocketState : {{currentWebSocketState}} </div>
        <div>userIsAuth : {{    userIsAuth    }} </div>

      </nav>
  </header>
  <main>
    <VideoStream v-if=" meetId" :userId="userId" />
    <RouterView />
  </main>

</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {useWebSocket} from "@/features/useWebSocket";
import {useCurrentUser} from "@/features/useCurrentUser";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";
import {useMeet} from "@/components/meet/features/useMeet";
import VideoStream from "@/components/VideoStream.vue";
import {watch} from "vue";
const {meetChatMessageHandle,userJoinMeetHandle,userLeaveMeetHandle, meetId} = useMeet();
const {setupWebSocketMessageHandlers,currentWebSocketState} = useWebSocket()
const { userIsAuth , userId } = useCurrentUser()
// todo server ws status indicator
// todo axios api instance
// todo add eslint prettier airbnb

 setupWebSocketMessageHandlers({
    [MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE]: [meetChatMessageHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET]: [userJoinMeetHandle],
    [MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET]: [userLeaveMeetHandle],
  })

// watch(meetId , async (val) => {
//
//   if (!val) {
//     return
//   }
//
//
//
// })

</script>


