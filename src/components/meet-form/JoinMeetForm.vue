<template>
  <fieldset :disabled="isLoading" class="form_wrapper">

    <LocalMedaStream  class="join-meet-local-stream"/>
    <LocalMediaControls/>

    <form @submit.prevent=" onSubmitForm" class="form">

      <label>you name
        <UiTextInput v-model="userName" placeholder="enter you name"/>
      </label>

      <span v-if="isPrivateMeet">
        this meet is private - <label for="meet-password" class="form_password-label"> enter password </label>
        <UiTextInput v-model="meetPassword" id="meet-password" placeholder="password"/>
      </span>

      <UiButton type="submit" :variant="UI_VARIANTS.PRIMARY" :loading="isLoading">
        join
      </UiButton>

    </form>
  </fieldset>
</template>

<script>
import {defineComponent, onMounted, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import UiButton from "@/components/ui/UiButton.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";
import LocalMedaStream from "@/components/meet-app/MediaStreams/LocalMedaStream.vue";
import LocalMediaControls from "@/components/meet-app/MediaStreams/LocalMediaControls.vue";
import {UI_VARIANTS} from "@/components/ui/constants/uiVariants.js";

export default defineComponent({
  name: "JoinMeetForm",
  computed: {
    UI_VARIANTS() {
      return UI_VARIANTS
    }
  },
  components: {LocalMediaControls, LocalMedaStream, UiTextInput, UiButton},
  setup() {

    const {localUserName, localUserIsConnectedToMeet , initLocalMediaStream} = useLocalUserStore()
    const {joinMeet, isPrivateMeet} = useMeetStore()
    const meetPassword = ref('')
    const userName = ref('')
    const isLoading = ref(false)

    const onSubmitForm = async () => {
      try {

        isLoading.value = true

        await joinMeet({
          userName: unref(userName),
          password: unref(meetPassword)
        })

      } catch (e) {

      } finally {
        isLoading.value = false
      }

    }


    onMounted(initLocalMediaStream)

    return {
      localUserIsConnectedToMeet,
      isPrivateMeet,
      isLoading,
      userName,
      meetPassword,
      onSubmitForm
    }
  }
})
</script>

<style lang="scss" scoped>
@use "./css/meet-form.scss";

.join-meet-local-stream {
  min-height: 400px;
}
</style>