<template>
  <div style="display: flex;">
    <LocalMedaStream/>
    <pre>    {{ remoteMediaSteams }} </pre>


    <RemoteMediaStream v-for="{ remoteUserId , status } in remoteMediaSteams"
                       :status="status"
                       :userId="remoteUserId"
                       :key="remoteUserId"
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

export default defineComponent({
  name: "MeetApp",
  components: {RemoteMediaStream, MeetChat, LocalMedaStream},
  setup() {


    const remoteMediaStreamsMap = reactive({})

    const remoteMediaSteams = computed(() => {
      return Object.values(unref(remoteMediaStreamsMap))
      // TODO -  придумать способ следить за юзерами которые онлайн  - может на беке + никнеймов здесь нет
    })
    const updatePeerStatusHandle = (eventData) => {

      const {remoteUserId, status} = eventData

      remoteMediaStreamsMap[remoteUserId] = eventData


      if (status === PEER_CONNECTIONS_STATE_STATUSES.NEW) {
        // remoteMediaStreamsComponentsMap.set(remoteUserId, new RemoteMediaStream({remoteUserId}))

        // mediaStreamsWrapper.append(remoteMediaStreamsComponentsMap.get(remoteUserId))
      }

      // if (remoteMediaStreamsComponentsMap.has(remoteUserId)) {
      //   remoteMediaStreamsComponentsMap.get(remoteUserId).setAttribute('peerStatus', status)
      // }

      if (DISCONNECTED_STATE_STATUSES.includes(status)) {
        remoteMediaStreamsMap[remoteUserId]  =  undefined
      }

    }


    const {listenEvent} = useEventBus()

    listenEvent(BUS_EVENTS.UPDATE_PEER_CONNECTION_STATUS, updatePeerStatusHandle)


    return {
      remoteMediaSteams
    }
  }
})
</script>

<style scoped>

</style>