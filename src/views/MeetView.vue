<template>
  <div v-if="isLoading">
    <h1 style="text-align: center"> Loading </h1>
  </div>

  <div v-if="!isLoading && !currentMeetId">
    <h1 style="text-align: center"> Cant Found Meet</h1>
  </div>

  <div v-if="!isLoading && currentMeetId">
    <JoinMeetForm v-if="!localUserIsConnectedToMeet"/>
    <MeetApp/>
  </div>

</template>

<script>

import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import { useLocalUserStore} from "@/store/localUserStore.js";
import {defineComponent, onMounted, ref, unref} from 'vue';
import JoinMeetForm from "@/components/JoinMeetForm.vue";
import MeetApp from "@/components/meet-app/MeetApp.vue";
import {useMeetStore} from "@/store/meetStore.js";
import {useRouteParams} from '@vueuse/router'
import {onBeforeRouteLeave} from "vue-router";
export default defineComponent({
  name: "MeetView",
  components: {MeetApp, JoinMeetForm, LocalMedaStream},

  setup() {
    const {findMeetById, setCurrentMeet, currentMeetId} = useMeetStore()
    const {localUserIsConnectedToMeet , initLocalMediaStream } = useLocalUserStore()

    const isLoading = ref(true)

    const meetId = useRouteParams('meetId')

    onMounted(async () => {

      try {
        isLoading.value = true

        const res = await findMeetById(unref(meetId))
        await initLocalMediaStream()

        setCurrentMeet(res.meetId)

      } catch (e) {

      } finally {
        isLoading.value = false
      }

    })

    onBeforeRouteLeave(() => {
      setCurrentMeet('')
    })

    return {
      currentMeetId,
      localUserIsConnectedToMeet,
      isLoading
    }
  }
})
</script>

<style scoped>

</style>