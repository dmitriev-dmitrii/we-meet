<template>
  <main>
    <h1>We meet!</h1>

    <button @click="onJoinClick">Присоединиться</button>

  </main>
</template>

<script setup lang="ts">
import {onMounted, unref, useTemplateRef} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import {usePeerConnection} from "@/features/usePeerConnection";
import {useCurrentUser} from "@/features/useCurrentUser";
import router from "@/router";

const { addWebSocketMessageHandlers, sendWebSocketMessage} = useWebSocket()

const {initUserStream}= useCurrentUser()


const {
  handleIceCandidate,
  handleOffer,
  handleUserConnection,
  handleAnswer
} = usePeerConnection( )


async function init() {
  try {

    await initUserStream();

    const events = [
      {
        type: 'user-connected',
        callback: handleUserConnection
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

    addWebSocketMessageHandlers(events)


  } catch (error) {
    console.error('Ошибка доступа к медиа-устройствам:', error);
  }

}

const onJoinClick = () => {

  const roomId = 123;
  sendWebSocketMessage ({ type: 'join', roomId } )
  console.log('Присоединение к комнате:', roomId);

  router.push({
    name:'MeetPage',
    params:{
      id:roomId
    }
  })

}

onMounted(() => {


  init();

})
</script>

