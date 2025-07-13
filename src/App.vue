<template>

  <div v-if="isLoading">loading</div>
  <RouterView   v-else/>

</template>

<script>
import {defineComponent, onMounted, ref, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {useMeetStore} from "@/store/meetStore.js";
import {WEB_SOCKET_EVENTS} from "@/constants/web-socket.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {useWebRtcStore} from "@/store/webRtcStore.js";

export default defineComponent({
  name: "App",

  components: {

  },
  setup() {
    const {fetchIceServers} = useWebRtcStore()
    const {setupOnWsMessageCallbacks} = useWebSocket()
    const {updateMeetUser, removeUserFromMeet} = useMeetStore()
    const {localUserIsConnectedToMeet} = useLocalUserStore()
    const {
      createPeerOffer,
      confirmPeerOffer,
      setupPeerAnswer,
      updatePeerIceCandidate,
    } = useWebRtcConnections()

    const onUserMeetConnected = (payload) => {
      // payload.data.meetUsers.forEach(updateMeetUser)
    }
    const onUserMeetDisconnected = ({fromUser}) => {
      removeUserFromMeet(fromUser.userId)
    }

    setupOnWsMessageCallbacks({
      [WEB_SOCKET_EVENTS.RTC_SEND_ME_OFFER]: createPeerOffer,
      [WEB_SOCKET_EVENTS.RTC_OFFER]: confirmPeerOffer,
      [WEB_SOCKET_EVENTS.RTC_ANSWER]: setupPeerAnswer,
      [WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE]: updatePeerIceCandidate,

      [WEB_SOCKET_EVENTS.WS_CONNECTION]: [onUserMeetConnected],
      [WEB_SOCKET_EVENTS.WS_CLOSE]: [onUserMeetDisconnected],
    })


    const isLoading = ref(true)


    onMounted(async () => {
      try {
        await fetchIceServers()
      } catch (e) {
        // TODO // обработать ошибки
      } finally {
        isLoading.value = false
      }

    })

    return {
      isLoading
    }
  }
})
</script>


<style lang="scss" scoped>





</style>
