<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">
    <video style="height: 200px;width: 200px" autoplay muted ref="localMedaStreamElement"></video>

    <label>
      audio
      <input v-model="audioCheckbox" type="checkbox">
    </label>

    <label>
      video
      <input v-model="videoCheckbox" type="checkbox">
    </label>

    <button v-if="localUserIsConnectedToMeet" @click="leaveMeet"> leave meet</button>
  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";
import {WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {useMeetStore} from "@/store/meetStore.js";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const {leaveMeet} = useMeetStore()
    const {sendDataChanelMessage} = useWebRtcDataChannels()
    const localMedaStreamElement = useTemplateRef('localMedaStreamElement')
    const {localUserIsConnectedToMeet} = useLocalUserStore()

    const audioCheckbox = ref(false)
    const videoCheckbox = ref(false)


    watch([audioCheckbox, videoCheckbox], () => {

      localUserStore.audio = unref(audioCheckbox)
      localUserStore.video = unref(videoCheckbox)

      const payload = {
          type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_MEDIA_TRACK_STATE,
          data: {
              video: localUserStore.video,
              audio: localUserStore.audio
          }
      }

      sendDataChanelMessage(payload)
    })

    onMounted(async () => {

      if (localUserStore.userStreams instanceof MediaStream) {
        unref(localMedaStreamElement).srcObject = localUserStore.userStreams
      }

      if (import.meta.env.DEV) {
        localUserStore.audio = false
      }

      audioCheckbox.value = localUserStore.audio
      videoCheckbox.value = localUserStore.video

    })

    return {
      localUserIsConnectedToMeet,
      leaveMeet,
      audioCheckbox,
      videoCheckbox
    }
  }
})
</script>

<style scoped>

</style>