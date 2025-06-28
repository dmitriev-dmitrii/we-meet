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

    <button v-if="localIsConnectedToMeet" @click="onLeaveMeet"> leave meet</button>
  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
import {useRouter} from "vue-router";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const router = useRouter()
    const {sendDataChanelMessage} = useWebRtcDataChannels()
    const localMedaStreamElement = useTemplateRef('localMedaStreamElement')

    const {localIsConnectedToMeet} = useLocalUserStore()

    const audioCheckbox = ref(false)
    const videoCheckbox = ref(false)

    const onLeaveMeet = () => {

      meetStore.leaveMeet()
      router.push({name:'HomeView'})
    }


    watch([audioCheckbox, videoCheckbox], () => {
      localUserStore.audio = unref(audioCheckbox)
      localUserStore.video = unref(videoCheckbox)

      const payload = {
          type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE,
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
      localIsConnectedToMeet,
      onLeaveMeet,
      audioCheckbox,
      videoCheckbox
    }
  }
})
</script>

<style scoped>

</style>