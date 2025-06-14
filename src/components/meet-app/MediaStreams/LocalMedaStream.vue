<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">
    <video style="height: 300px" autoplay muted ref="localMedaStreamElement"></video>

    <label>
      audio
      <input v-model="audioCheckbox" type="checkbox">
    </label>

    <label>
      video
      <input v-model="videoCheckbox" type="checkbox">
    </label>

    <button @click="onLeaveMeet"> leave meet</button>
  </div>

</template>

<script>

import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue';
import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "LocalMedaStream",
  setup() {
    const router = useRouter()
    const localMedaStreamElement = useTemplateRef('localMedaStreamElement')

    const audioCheckbox = ref(false)
    const videoCheckbox = ref(false)

    const onLeaveMeet = () => {

      meetStore.leaveMeet()
      router.push({name:'HomeView'})
    }


    watch([audioCheckbox, videoCheckbox], () => {
      localUserStore.audio = unref(audioCheckbox)
      localUserStore.video = unref(videoCheckbox)
    })

    onMounted(async () => {

      await localUserStore.initLocalMediaStream()

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
      onLeaveMeet,
      audioCheckbox,
      videoCheckbox
    }
  }
})
</script>

<style scoped>

</style>