<template>
  <h1>MeetStreams</h1>
  <div ref="videoStreamsWrapper">

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, unref, useTemplateRef, watch} from 'vue'
import {useMeetStreams} from "@/components/meet/streams/useMeetStreams";

export default defineComponent({
  name: "MeetStreams",
  setup() {

    const {initLocalStream , mediaStreams}  = useMeetStreams()
    const videoStreamsMap = new Map()
    const videoStreamsWrapper = useTemplateRef('videoStreamsWrapper')

    const appendVideo = async ( { stream , userId } ) => {

      const videoElement = document.createElement('video');

      videoElement.srcObject = stream;

      videoElement.setAttribute("id", userId);
      videoElement.autoplay = true
      videoElement.muted = true

      videoStreamsMap.set( userId , videoElement )

      unref(videoStreamsWrapper).append(videoElement);
    }


    watch( mediaStreams, async  (value)=> {

      await appendVideo(value[value.length -1])

    },{
      deep:true
    })

    onMounted( async ()=> {
     await initLocalStream()
    })


    return {

    }
  }
})
</script>

<style scoped>

</style>