<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">

    <video style="height: 200px;width: 200px" autoplay muted ref="localMedaStreamElement"></video>

    <div>enabled {{ enabled }}</div>

    <label>
      <span>  videoInput </span>
      <select id="audio-input-select" :disabled="videoInputs.length <= 1">
        <option :value="deviceId" v-for="{deviceId , label} in videoInputs" :key="deviceId">
          {{ label }}
        </option>
      </select>

    </label>

    <label>
      <span>audioInput </span>
      <select id="audio-input-select" :disabled="audioInputs.length <= 1">
        <option :value="deviceId" v-for="{deviceId , label} in audioInputs" :key="deviceId">
          {{ label }}
        </option>
      </select>

    </label>

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
    const {
      localUserIsConnectedToMeet,
      videoInputs,
      audioInputs,
      localUserStreams,enabled

    } = useLocalUserStore()

    const audioCheckbox = ref(false)
    const videoCheckbox = ref(false)

    const playLocalStream = () => {

      if (unref(localUserStreams) instanceof MediaStream) {
        unref(localMedaStreamElement).srcObject = unref(localUserStreams)
      }
    }

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

    watch(localUserStreams, playLocalStream)

    onMounted(async () => {

      playLocalStream()


      if (import.meta.env.DEV) {
        localUserStore.audio = false
      }

      audioCheckbox.value = localUserStore.audio
      videoCheckbox.value = localUserStore.video

    })

    return {

      videoInputs,
      audioInputs,
      localUserIsConnectedToMeet,
      leaveMeet,
      audioCheckbox,
      videoCheckbox,
      enabled
    }
  }
})
</script>

<style scoped>

</style>