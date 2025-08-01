<template>
  <div class="meda-streams-layout" :class="mediaStreamLayoutClasses">
    <LocalMedaStream class="meda-stream"/>
    <RemoteMediaStream class="meda-stream"
                       v-for="{ userId  , userName ,userAccentColor, peerStatus ,audio, video} in remoteMediaSteams"
                       :userAccentColor="userAccentColor"
                       :peerStatus="peerStatus"
                       :userName="userName"
                       :userId="userId"
                       :audio="audio"
                       :video="video"
                       :key="userId"
    />
  </div>
  <!--  <MeetChat v-if="remoteMediaSteams.length"/>-->
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref, unref, watch} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import MeetChat from "@/components/meet-app/MeetChat.vue";
import RemoteMediaStream from "@/components/meet-app/MediaStreams/RemoteMediaStream.vue";
import {useMeetStore} from "@/store/meetStore.js";
import {useCssVar} from '@vueuse/core'


export default defineComponent({
  name: "MeetApp",
  components: {
    RemoteMediaStream, MeetChat, LocalMedaStream
  },
  setup() {
    const {remoteUsersMap} = useMeetStore()

    // const mediaStreamSize = useCssVar('--media-stream-size')
    //
    // const mediaStreamWidth = useCssVar('--media-stream-width')
    // const mediaStreamHeight = useCssVar('--media-stream-height')
    //

    const mediaStreamLayoutClasses = computed(() => {
      return {
        [`u-${unref(Object.keys(remoteUsersMap).length + 1)}`]: true
      }
    })

    const remoteMediaSteams = computed(() => {

      return Object.values(unref(remoteUsersMap)).filter(Boolean)
    })


    // watch(remoteMediaSteams, () => {
    //   const remoteUsersCount = Object.values(unref(remoteUsersMap)).length
    //
    // })

    return {
      mediaStreamLayoutClasses,
      remoteMediaSteams
    }
  }
})
</script>

<style lang="scss" scoped>

$gap: 0.5rem;

.meda-streams-layout {
  height: 100vh;
  gap: $gap;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  transition: 300ms;

  &.u-1 {
    grid-template-columns: 0.5fr;
    grid-template-rows: 0.5fr;
  }

  &.u-2 {
    grid-template-columns: 1fr;
    grid-template-rows: 50vh;
  }
}

.meda-stream {
  overflow: hidden;
  max-width: 100%;
  border-radius: $base-border-radius;
}



</style>