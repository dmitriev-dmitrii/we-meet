<template>
  <div class="meet-chat-sounds__wrapper">

    <UiButton class="meet-chat-sounds__button" v-for="{ id , sound , icon  , title } in sounds" :size="UI_SIZES.SMALL">
      id
    </UiButton>

  </div>
</template>

<script>
import {defineComponent} from 'vue'
import UiButton from "@/components/ui/UiButton.vue";
import {UI_SIZES} from "@/components/ui/constants/uiSizes.js";

export default defineComponent({
  name: "MeetChatSounds",
  components: {UiButton},
  setup() {

    const sounds = new Array(8).fill({id: 1, sound: '', icon: '', title: 'x'})

    return {
      sounds,
      UI_SIZES,
    }
  }
})
</script>

<style scoped lang="scss">
.meet-chat-sounds {

  &__wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap-reverse;
  }

  &__button {
    flex: 1 1 25%;
  }

}


</style>