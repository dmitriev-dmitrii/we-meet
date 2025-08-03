<template>

  <div class="media-stream">

    <div class="media-stream__label">{{localUserNameLabel}}</div>
    <video class="media-stream__video" autoplay muted ref="localMedaStreamElement"></video>
  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useLocalUserStore} from "@/store/localUserStore.js";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const localMedaStreamElement = useTemplateRef('localMedaStreamElement')
    const {
      localUserIsConnectedToMeet,
      localUserName,
      localUserMediaStreams,
    } = useLocalUserStore()

    const playLocalStream = () => {

      if (unref(localUserMediaStreams) instanceof MediaStream) {
        unref(localMedaStreamElement).srcObject = unref(localUserMediaStreams)
      }
    }

    watch(localUserMediaStreams, playLocalStream)

    const localUserNameLabel = unref(localUserName)[0]

    onMounted(async () => {

      playLocalStream()

    })

    return {
      localUserNameLabel,
      localUserIsConnectedToMeet,
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "./css/media-stream";
</style>