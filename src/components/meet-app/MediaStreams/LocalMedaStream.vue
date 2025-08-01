<template>

  <div class="local-media-stream">

    <div class="local-media-stream__label">{{localUserNameLabel}}</div>
    <video class="local-media-stream__video" autoplay muted ref="localMedaStreamElement"></video>

    <div class="local-media-stream__controls">
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


  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
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
      localUserName,
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

    const localUserNameLabel = unref(localUserName)[0]

    onMounted(async () => {

      playLocalStream()


      if (import.meta.env.DEV) {
        localAudioState.value = false
      }

      audioCheckbox.value = unref(localAudioState)
      videoCheckbox.value = unref(localVideoState)

    })

    return {
      localUserNameLabel,
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

<style lang="scss" scoped>

.local-media-stream {
  position: relative;
  width: 100%;
  height: 100%;

  &__label,
  &__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__label {
    z-index: 0;
  }

  &__video {
    object-fit: cover;
    z-index: 1;
  }

  &__controls {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
  }
}

</style>