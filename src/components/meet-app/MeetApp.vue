<template>
  <div style="display: flex;">
    <LocalMedaStream/>
    <RemoteMediaStream v-for="{ userId , userName ,userAccentColor, peerStatus } in remoteMediaSteams"
                       :userAccentColor="userAccentColor"
                       :peerStatus="peerStatus"
                       :userName="userName"
                       :userId="userId"
                       :key="userId"
    />
  </div>

  <MeetChat></MeetChat>
</template>

<script>
import {computed, defineComponent, reactive, ref, unref} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import MeetChat from "@/components/meet-app/MeetChat.vue";
import RemoteMediaStream from "@/components/meet-app/MediaStreams/RemoteMediaStream.vue";
import {BUS_EVENTS, DISCONNECTED_STATE_STATUSES, PEER_CONNECTIONS_STATE_STATUSES} from "@/constants/constants.js";
import {useEventBus} from "@/features/useEventBus.js";
import {useMeetStore} from "@/store/meetStore.js";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";

export default defineComponent({
  name: "MeetApp",
  components: {RemoteMediaStream, MeetChat, LocalMedaStream},
  setup() {
    const {remoteUsersMap} = useMeetStore()

    const remoteMediaSteams = computed(() => {

      return Object.values(unref(remoteUsersMap)).filter(Boolean)
    })

    return {
      remoteMediaSteams
    }
  }
})
</script>

<style scoped>

</style>