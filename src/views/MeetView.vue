<template>
  <div v-if="isLoading">
    <h1 style="text-align: center"> Loading </h1>
  </div>

  <div v-if="!isLoading && !isFoundMeet">
    <h1 style="text-align: center"> Cant Found Meet</h1>
  </div>

  <div v-if="!isLoading && isFoundMeet">
    <JoinMeetForm v-if="!localIsConnectedToMeet"></JoinMeetForm>
    <MeetApp></MeetApp>
  </div>

</template>

<script>
import {computed, defineComponent, onMounted, ref, unref} from 'vue'
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import {useRouteParams} from '@vueuse/router'
import {meetStore, useMeetStore} from "@/store/meetStore.js";
import JoinMeetForm from "@/components/JoinMeetForm.vue";
import MeetApp from "@/components/meet-app/MeetApp.vue";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";

export default defineComponent({
  name: "MeetView",
  components: {MeetApp, JoinMeetForm, LocalMedaStream},

  setup() {
    const {localIsConnectedToMeet} = useLocalUserStore()

    const isFoundMeet = ref(false)
    const isLoading = ref(true)

    const meetId = useRouteParams('meetId')

    onMounted(async () => {

      try {
        isLoading.value = true

        const res = await meetStore.findMeetById(unref(meetId))
        await localUserStore.initLocalMediaStream()

        isFoundMeet.value = !!res.meetId


      } catch (e) {

      } finally {
        isLoading.value = false
      }

    })

    return {
      localIsConnectedToMeet,
      isFoundMeet,
      isLoading
    }
  }
})
</script>

<style scoped>

</style>