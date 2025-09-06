<template>
  <div class="meet-view">
    <component :is="currentMeetViewComponent"/>
  </div>
</template>

<script>

import LocalMedaStream from "@/components/meet-app/media-streams/LocalMedaStream.vue";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {computed, defineComponent, onMounted, ref, unref} from 'vue';
import JoinMeetForm from "@/components/meet-form/JoinMeetForm.vue";

import {useMeetStore} from "@/store/meetStore.js";
import {useRouteParams} from '@vueuse/router'
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {useWebSocket} from "@/features/useWebSocket.js";
import MeetChat from "@/components/meet-app/meet-chat/MeetChat.vue";
import MediaStreamsLayout from "@/components/meet-app/MediaStreamsLayout.vue";
import MeetApp from "@/components/meet-app/MeetApp.vue";
import UiLoading from "@/components/ui/UiLoading.vue";
import {ROUTER_NAMES} from "@/router/constants/routerNames.js";

const MEET_VIEW_STEPS_COMPONENTS_MAP = {
  SEARCH_MEET: UiLoading,
  JOIN_MEET: JoinMeetForm,
  STARTED_MEET: MeetApp,
}

export default defineComponent({
  name: "MeetView",
  components: {
    UiLoading,
    MeetApp,
    MediaStreamsLayout,
    MeetChat,
    JoinMeetForm,
    LocalMedaStream
  },

  setup() {
    const {closeWebSocket} = useWebSocket()
    const router = useRouter()
    const {
      findMeetById,
      setCurrentMeet,
    } = useMeetStore()

    const {
      localUserIsConnectedToMeet,
    } = useLocalUserStore();

    const isLoading = ref(true)

    const currentMeetViewComponent = computed(() => {

      if (unref(isLoading)) {
        return MEET_VIEW_STEPS_COMPONENTS_MAP.SEARCH_MEET
      }

      if (!unref(isLoading) && !unref(localUserIsConnectedToMeet)) {
        return MEET_VIEW_STEPS_COMPONENTS_MAP.JOIN_MEET
      }

      if (unref(localUserIsConnectedToMeet)) {
        return MEET_VIEW_STEPS_COMPONENTS_MAP.STARTED_MEET
      }

    })

    const meetId = useRouteParams('meetId');

    onMounted(async () => {

      try {
        isLoading.value = true

        const res = await findMeetById(unref(meetId))

        setCurrentMeet(res.meetId)

      } catch (error) {
        console.log(error)
        await router.replace({
          name: ROUTER_NAMES.ERROR,
          state: error,
        })

        setCurrentMeet('')

      } finally {
        isLoading.value = false
      }

    })

    onBeforeRouteLeave(() => {

      setCurrentMeet('')
      closeWebSocket()

    })

    return {
      currentMeetViewComponent
    }
  }
})
</script>

<style lang="scss" scoped>
.meet-view {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

</style>