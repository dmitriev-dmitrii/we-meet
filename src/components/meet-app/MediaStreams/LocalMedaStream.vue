<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">

    <video style="height: 200px;width: 200px" autoplay muted ref="localMedaStreamElement"></video>


<!--    <label>-->
<!--      <span>  videoInput </span>-->
<!--      <select id="video-input-select" :disabled="videoInputs.length <= 1">-->
<!--        <option :value="deviceId" v-for="{deviceId , label} in videoInputs" :key="deviceId">-->
<!--          {{ label }}-->
<!--        </option>-->
<!--      </select>-->

<!--    </label>-->

<!--    <label>-->
<!--      <span>audioInput </span>-->
<!--      <select id="audio-input-select" :disabled="audioInputs.length <= 1">-->
<!--        <option :value="deviceId" v-for="{deviceId , label} in audioInputs" :key="deviceId">-->
<!--          {{ label }}-->
<!--        </option>-->
<!--      </select>-->

<!--    </label>-->


    <label>
      audio state
      <input v-model="audioCheckbox" :disabled="!isAllowLocalMediaPermissions" type="checkbox">
    </label>

    <label>
      video state
      <input v-model="videoCheckbox" :disabled="!isAllowLocalMediaPermissions" type="checkbox">
    </label>

    <button v-if="localUserIsConnectedToMeet" @click="leaveMeet"> leave meet</button>
  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import { useLocalUserStore} from "@/store/localUserStore.js";
import {WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {useMeetStore} from "@/store/meetStore.js";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const {leaveMeet} = useMeetStore()
    const {sendDataChanelMessage} = useWebRtcDataChannels()
    const localMedaStreamElement = useTemplateRef('localMedaStreamElement')
    const {
      isAllowLocalMediaPermissions,
      localUserIsConnectedToMeet,
      videoInputs,
      audioInputs,
      localUserMediaStreams,
      localAudioState,
      localVideoState,
    } = useLocalUserStore()

    const audioCheckbox = ref(false)
    const videoCheckbox = ref(false)

    watch([audioCheckbox, videoCheckbox], () => {

      localAudioState.value = unref(audioCheckbox)
      localVideoState.value = unref(videoCheckbox)

      const payload = {
        type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_MEDIA_TRACK_STATE,
        data: {
          video: localAudioState.value,
          audio: localVideoState.value
        }
      }

      sendDataChanelMessage(payload)
    })

    const playLocalStream = () => {

      if (unref(localUserMediaStreams) instanceof MediaStream) {
        unref(localMedaStreamElement).srcObject = unref(localUserMediaStreams)
      }
    }

    watch(localUserMediaStreams, playLocalStream)

    onMounted(async () => {

      playLocalStream()


      if (import.meta.env.DEV) {
        localAudioState.value = false
      }

      audioCheckbox.value = unref(localAudioState)
      videoCheckbox.value = unref(localVideoState)

    })

    return {
      isAllowLocalMediaPermissions,
      videoInputs,
      audioInputs,
      localUserIsConnectedToMeet,
      leaveMeet,
      audioCheckbox,
      videoCheckbox,
    }
  }
})
</script>

<style scoped>

</style>