<template>
  <!--  <MeetStreams v-if="meetStore.meetId"/>-->
  <MeetChat v-if="meetStore.meetId" />
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import MeetChat from "@/components/meet/chat/MeetChat.vue";
import {useUserStore} from "@/store/useUserStore";
import {useMeetStore} from "@/store/useMeetStore";

export default defineComponent({
  name: "Meet",
  components: {MeetChat},
  setup() {
    const userStore = useUserStore()
    const meetStore = useMeetStore()

    return {
      userStore ,
      meetStore
    }
  }
})
</script>

<style scoped>

</style>