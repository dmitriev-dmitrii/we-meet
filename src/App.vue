<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <router-link to="/">

      <img src="/vite.svg" class="logo" alt="Vite logo"/>

    </router-link>
    <div>
      wsClientsOnline {{wsClientsOnline}}
    </div>
  </div>

  <RouterView/>
</template>

<script>
import {defineComponent, ref} from "vue";
import {useWebSocket} from "@/features/useWebSocket.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {WEB_SOCKET_EVENTS} from "@/constants/constants.js";

export default defineComponent({

  name: "App",

  setup() {

    const {setupOnWsMessageCallbacks} = useWebSocket()

    const wsClientsOnline = ref(0)
    const updateWsOnlineClients = ({data}) => {

      wsClientsOnline.value =  data.wsClientsOnline.length

  }

    const {
      createPeerOffer,
      confirmPeerOffer,
      setupPeerAnswer,
      updatePeerIceCandidate,
    } = useWebRtcConnections()

    setupOnWsMessageCallbacks({
      [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: [createPeerOffer],
      [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
      [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
      [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,

      [WEB_SOCKET_EVENTS.WS_CONNECTION]: updateWsOnlineClients,
      [WEB_SOCKET_EVENTS.WS_CLOSE]: [updateWsOnlineClients],
    })


    return {
      wsClientsOnline
    }
  }
})
</script>


<style scoped>
.logo {
  height: 2em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
