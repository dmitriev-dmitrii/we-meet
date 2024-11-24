<template>
  <div class="video-stream">
    <video ref="videoStreamElement" :controls="false">

    </video>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  unref,
  useTemplateRef
} from 'vue'

export default defineComponent({
  name: "VideoStream",
  props:{
    userId: {
      default :''
    }
  },
  setup() {
    const videoStreamElement = useTemplateRef('videoStreamElement')

    // isAudioOn :{
    // default: false
    // },
    // isVideoOn :{
    // default: false
    // },

    onMounted(async ()=> {

      // console.log(unref(videoStreamElement))
    })

    return {}
  }
})
</script>

<style scoped>

</style>