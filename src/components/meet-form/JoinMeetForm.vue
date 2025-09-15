<template>
  <fieldset :disabled="isLoading || isLoadingLocalMedia" class="form_wrapper">

    <LocalMedaStream class="join-meet-local-stream"/>
    <LocalMediaControls/>

    <form @submit.prevent=" onSubmitForm" class="form">


      <label>coturn
        <input type="checkbox" v-model="coturn">
      </label>


      <label>you name
        <UiTextInput v-model.trim="userName" placeholder="enter you name"/>
      </label>

      <span v-if="isPrivateMeet">
        this meet is private - <label for="meet-password" class="form_password-label"> enter password </label>
        <UiTextInput v-model="meetPassword" id="meet-password" placeholder="password"/>
      </span>

      <UiButton type="submit" :variant="UI_VARIANTS.PRIMARY" :loading="isLoading || isLoadingLocalMedia">
        join
      </UiButton>

    </form>
  </fieldset>
</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import UiButton from "@/components/ui/UiButton.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";
import LocalMedaStream from "@/components/meet-app/media-streams/LocalMedaStream.vue";
import LocalMediaControls from "@/components/meet-app/media-streams/LocalMediaControls.vue";
import {UI_VARIANTS} from "@/components/ui/constants/uiVariants.js";

export default defineComponent({
  name: "JoinMeetForm",
  components: {LocalMediaControls, LocalMedaStream, UiTextInput, UiButton},
  setup() {

    const {localUserIsConnectedToMeet, isLoadingLocalMedia} = useLocalUserStore()
    const {joinMeet, isPrivateMeet} = useMeetStore()
    const meetPassword = ref('')
    const userName = ref('')

    const isLoading = ref(false)
    const coturn = ref(false)

    const onSubmitForm = async () => {
      try {

        isLoading.value = true

        await joinMeet({
          userName: unref(userName),
          password: unref(meetPassword),
          coturn: unref(coturn)
        })

      } catch (err) {

      } finally {
        isLoading.value = false
      }

    }

    return {
      coturn,
      UI_VARIANTS,
      localUserIsConnectedToMeet,
      isPrivateMeet,
      isLoadingLocalMedia,
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