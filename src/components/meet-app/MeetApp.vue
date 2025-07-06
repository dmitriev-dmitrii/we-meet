<template>
  <div style="display: flex;">
    <LocalMedaStream/>
    <RemoteMediaStream v-for="{ userId  , userName ,userAccentColor, peerStatus ,audio, video} in remoteMediaSteams"
                       :userAccentColor="userAccentColor"
                       :peerStatus="peerStatus"
                       :userName="userName"
                       :userId="userId"
                       :audio="audio"
                       :video="video"
                       :key="userId"
    />
  </div>

  <MeetChat v-if="remoteMediaSteams.length"/>
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref, unref} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import MeetChat from "@/components/meet-app/MeetChat.vue";
import RemoteMediaStream from "@/components/meet-app/MediaStreams/RemoteMediaStream.vue";
import {useMeetStore} from "@/store/meetStore.js";


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