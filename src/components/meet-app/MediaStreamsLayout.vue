<template>
  <div class="meda-streams-layout" :class="mediaStreamLayoutClasses">
    <LocalMedaStream class="local-stream"/>
    <RemoteMediaStream
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
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref, unref, watch} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import MeetChat from "@/components/meet-app/MeetChat.vue";
import RemoteMediaStream from "@/components/meet-app/MediaStreams/RemoteMediaStream.vue";
import {useMeetStore} from "@/store/meetStore.js";
import {useCssVar} from '@vueuse/core'


export default defineComponent({
  name: "MediaStreamsLayout",
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


    const remoteMediaSteams = computed(() => {

      return Object.values(unref(remoteUsersMap)).filter(Boolean)
    })

    const mediaStreamLayoutClasses = computed(() => {
      return {
        [`u-${unref(unref(remoteMediaSteams).length + 1)}`]: true
      }
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



.local-stream {
  grid-area: local-stream;
}

.meda-streams-layout {

  height: 100%;
  width: 100%;

  max-height: 100%;
  max-width: 100%;

  gap: $base-gap;
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;

  grid-template-areas:
  ". . ."
  ". . ."
  ". . local-stream";

  transition: .3s;


  & > :nth-child(n) {
    overflow: hidden;
    max-width: 100%;
    border-radius: $base-border-radius;
  }

  &.u-1 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas:
    "local-stream local-stream";
  }

  &.u-2 {
    grid-template-columns: 50%;
    grid-template-rows: 50%;

    grid-template-areas:
    "."
    "local-stream";
  }

  &.u-3 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    grid-template-areas:
    ". ."
    "local-stream local-stream";
  }


  &.u-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    grid-template-areas:
    ". ."
    ". local-stream";
  }

  &.u-5 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    grid-template-areas:
    ". ."
    ". ."
    "local-stream local-stream";
  }
}


</style>