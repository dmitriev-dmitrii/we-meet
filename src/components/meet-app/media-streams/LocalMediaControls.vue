<template>
  <div class="local-media-controls">

    <label>
      audio
      <input v-model="localAudioState" :disabled="isDisabledControls" type="checkbox">
    </label>

    <label>
      video
      <input v-model="localVideoState" :disabled="isDisabledControls" type="checkbox">
    </label>

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
import {computed, defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue'
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import UiButton from "@/components/ui/UiButton.vue";

export default defineComponent({
  name: "LocalMediaControls",
  components: {UiButton},
  setup() {
    const {sendDataChanelMessage} = useWebRtcDataChannels()

    const {
      isLoadingLocalMedia,
      isAllowLocalMediaPermissions,
      localUserIsConnectedToMeet,
      initLocalMediaStream,
      videoInputs,
      audioInputs,
      localAudioState,
      localVideoState,
    } = useLocalUserStore()

    const isDisabledControls = computed(()=> unref(isLoadingLocalMedia) && !unref(isAllowLocalMediaPermissions))

    watch([localAudioState, localVideoState], () => {
      const payload = {
        type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_MEDIA_TRACK_STATE,
        data: {
          video: localAudioState.value,
          audio: localVideoState.value
        }
      }

      sendDataChanelMessage(payload)
    })

    onMounted(async () => {

      await initLocalMediaStream()

      if (import.meta.env.DEV) {
        localAudioState.value = false
      }

    })

    return {
      isDisabledControls,
      localUserIsConnectedToMeet,
      videoInputs,
      audioInputs,
      localAudioState,
      localVideoState
    }
  }
})
</script>

<style scoped lang="scss">
.local-media-controls {
  display: flex;
  gap: $base-gap;
}

</style>