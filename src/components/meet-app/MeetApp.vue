<template>
<LocalMedaStream></LocalMedaStream>
  <MeetChat></MeetChat>
</template>

<script>
import {defineComponent} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import MeetChat from "@/components/meet-app/MeetChat.vue";

export default defineComponent({
  name: "MeetApp",
  components: {MeetChat, LocalMedaStream},
  setup() {

    return {}
  }
})
</script>

<style scoped>

</style>