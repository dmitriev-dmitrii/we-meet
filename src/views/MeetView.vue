<template>

  <div v-if="isLoading">
    <h1 style="text-align: center">  Loading </h1>
  </div>

  <div v-if="!isLoading && !isFoundMeet">
  <h1 style="text-align: center">  Cant Found Meet</h1>
  </div>

  <div v-if="isFoundMeet">
    <JoinMeetForm></JoinMeetForm>
    <MeetApp></MeetApp>
  </div>

</template>

<script>
import {defineComponent, onMounted, ref, unref} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import {useRouteParams} from '@vueuse/router'
import {meetStore} from "@/store/meetStore.js";
import JoinMeetForm from "@/components/JoinMeetForm.vue";
import MeetApp from "@/components/meet-app/MeetApp.vue";

export default defineComponent({
  name: "MeetView",
  components: {MeetApp, JoinMeetForm, LocalMedaStream},

  setup() {
    const isFoundMeet = ref(false)
    const isLoading = ref(true)
    
    const meetId = useRouteParams('meetId')
    
    onMounted(async () => {

      try {
        isLoading.value = true
        await meetStore.findMeetById(unref(meetId))
      } catch (e) {

      }
      finally {
        isLoading.value = false
        isFoundMeet.value = !!meetStore.meetId
      }

    })

    return {
      isFoundMeet,
      isLoading
    }
  }
})
</script>

<style scoped>

</style>