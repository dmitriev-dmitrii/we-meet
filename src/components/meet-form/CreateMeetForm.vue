<template>
  <fieldset :disabled="isLoading" class="form_wrapper">
    <legend class="form_title">
      <h2> Lets create new meet </h2>
    </legend>

    <form @submit.prevent="onSubmitForm" class="form">


      <!--      <p v-if="!meetId"> if y want create private meet - -->
      <!--        <label for="meet-password" class="form_password-label">-->
      <!--          enter password-->
      <!--        </label>-->
      <!--      </p>-->

      <!--      <UiTextInput v-if="!meetId" id="meet-password" hidden v-model="meetPassword" placeholder="password"/>-->

      <UiButton type="submit" v-if="!meetId" :variant="UI_VARIANTS.PRIMARY" :loading="isLoading">
        create new meet
      </UiButton>

      <UiButton type="button" @click="copyMeetHref" v-if="meetId">
        copy meet link
      </UiButton>

      <UiButton type="button" @click="toMeet" v-if="meetId" :variant="UI_VARIANTS.PRIMARY">
        to meet →
      </UiButton>
    </form>

  </fieldset>
</template>

<script>
import {computed, defineComponent, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";

import {useRouter} from "vue-router";
import UiButton from "@/components/ui/UiButton.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";
import {UI_VARIANTS} from "@/components/ui/constants/uiVariants.js";
import {ROUTER_NAMES} from "@/router/constants/routerNames.js";

export default defineComponent({
  name: "CreateMeetForm",
  components: {UiButton, UiTextInput},
  setup() {
    const {createMeet} = useMeetStore()
    const router = useRouter()

    const meetPassword = ref('')
    const meetId = ref('')

    const isLoading = ref(false)

    const currentMeetRoute = computed(() => {
      return router.resolve({
        name: ROUTER_NAMES.MEET,
        params: {
          meetId: unref(meetId)
        }
      })
    })

    const copyMeetHref = async () => {
      await window.navigator.clipboard.writeText(window.location.origin + unref(currentMeetRoute).href)
    }

    const toMeet = async () => {
      await router.push(unref(currentMeetRoute))
    }

    const onSubmitForm = async () => {
      try {


        isLoading.value = true

        const res = await createMeet({
          password: unref(meetPassword)
        })

        meetId.value = res.meetId

        isLoading.value = false
      } catch (error) {

        console.log(error)
        await router.push({
          name: ROUTER_NAMES.ERROR,
          state: error,
        })
      }
    }

    return {
      UI_VARIANTS,
      isLoading,
      meetId,
      meetPassword,
      onSubmitForm,
      copyMeetHref,
      toMeet
    }
  }
})
</script>

<style lang="scss" scoped>
@use "./css/meet-form.scss";
</style>