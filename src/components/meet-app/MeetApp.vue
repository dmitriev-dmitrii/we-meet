<template>
  <div class="meet-app">
    <div class="meet-app__content">
      <MediaStreamsLayout class="meet-app__content__streams"/>
      <MeetChat class="meet-app__content__chat" :class="{ hidden : meetChatIsHidden }"/>
    </div>
    <div class="meet-app__controls">
      <LocalMediaControls/>
      <button v-if="localUserIsConnectedToMeet" @click="leaveMeet"> leave meet</button>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from 'vue'
import MeetChat from "@/components/meet-app/meet-chat/MeetChat.vue";
import MediaStreamsLayout from "@/components/meet-app/MediaStreamsLayout.vue";

import {useLocalUserStore} from "@/store/localUserStore.js";
import LocalMediaControls from "@/components/meet-app/MediaStreams/LocalMediaControls.vue";
import {useMeetStore} from "@/store/meetStore.js";

export default defineComponent({
  name: "MeetApp",
  components: {LocalMediaControls, MediaStreamsLayout, MeetChat},
  setup() {
    const {leaveMeet} = useMeetStore()
    const {
      localUserIsConnectedToMeet,
    } = useLocalUserStore();

    const meetChatIsHidden = ref(false)

    return {
      meetChatIsHidden,
      leaveMeet,
      localUserIsConnectedToMeet
    }
  }
})
</script>

<style scoped lang="scss">

.meet-app {
  padding: $base-gap;
  height: 100%;
  display: flex;
  gap: $base-gap;
  flex-direction: column;

  .meet-app__content {
    display: flex;
    gap: $base-gap;
    width: 100%;
    height: 100%;

    &__streams {
      flex: 100%;
      transition: flex 0.3s ease;
    }

    &__chat.hidden {
      width: 0;
      opacity: 0;
      position: absolute;
      flex: 0 0 0;
    }

    &__chat {
      width: 100%;
      flex: 40%;
      transition: flex 0.3s ease, opacity 0.3s 0.3s ease-in;
      align-self: flex-end;
    }

  }

  &__controls {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    z-index: 1;
    //width: 100%;
    height: 5rem;
    display: flex;
    align-items: center;
    gap: $base-gap;
  }
}
</style>