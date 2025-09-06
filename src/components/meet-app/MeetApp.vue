<template>
  <div class="meet-app">

    <div class="meet-app__content">

      <MediaStreamsLayout class="meet-app__content__streams"/>

      <div class="meet-app__content__controls">
        <LocalMediaControls/>
        <UiButton size="sm" variant="danger" v-if="localUserIsConnectedToMeet" @click=" onLeaveMeetClick">
          leave meet
        </UiButton>
      </div>

    </div>

    <div class="meet-app__sidebar">
      <MeetChat :class="{ hidden : meetChatIsHidden }"/>
    </div>

  </div>

</template>

<script>
import {defineComponent, onMounted, ref} from 'vue'
import MeetChat from "@/components/meet-app/meet-chat/MeetChat.vue";
import MediaStreamsLayout from "@/components/meet-app/MediaStreamsLayout.vue";

import {useLocalUserStore} from "@/store/localUserStore.js";
import LocalMediaControls from "@/components/meet-app/media-streams/LocalMediaControls.vue";
import {useMeetStore} from "@/store/meetStore.js";
import UiButton from "@/components/ui/UiButton.vue";
import {useRouter} from "vue-router";
import {ROUTER_NAMES} from "@/router/constants/routerNames.js";

export default defineComponent({
  name: "MeetApp",
  components: {UiButton, LocalMediaControls, MediaStreamsLayout, MeetChat},
  setup() {
    const router = useRouter()
    const {leaveMeet} = useMeetStore()

    const {
      localUserIsConnectedToMeet,
    } = useLocalUserStore();

    const meetChatIsHidden = ref(false)

    const onLeaveMeetClick = async () => {
      await leaveMeet()
      await router.push({name: ROUTER_NAMES.HOME})
    }

    return {
      meetChatIsHidden,
      onLeaveMeetClick,
      localUserIsConnectedToMeet
    }
  }
})
</script>

<style scoped lang="scss">

.meet-app {
  padding: $base-gap;
  height: 100%;
  width: 100%;
  display: flex;
  gap: $base-gap;

  &__content {
    border-radius: $base-border-radius;
    display: flex;
    flex-direction: column;
    gap: $base-gap;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    &__streams {
      transition: flex 0.3s ease;
    }

    &__controls {
      display: flex;
      justify-content: center;
      gap: $base-gap;

      width: 100%;
    }

  }

  &__sidebar {
    flex: 40%;
    width: 100%;

    transition: flex 0.3s ease, opacity 0.3s 0.3s ease-in;
    align-self: flex-end;

    &.hidden {
      width: 0;
      opacity: 0;
      position: absolute;
      flex: 0 0 0;
    }
  }

}
</style>