<template>
  <form @submit.prevent=" onSubmitForm " action="">

    <label> name
      <input>
    </label>

    <label> password
      <input v-model="meetPassword">
    </label>

    <button type="submit">
      join
    </button>
  </form>

</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {meetStore} from "@/store/meetStore.js";
export default defineComponent({
  name: "JoinMeetForm",
  setup() {

    const meetPassword = ref('')
    const isLoading = ref(false)

    const onSubmitForm = async () => {
      try {

        isLoading.value = true
        await meetStore.joinMeet()
      } catch (e) {

      } finally {
        isLoading.value = false
      }

    }

    return {
      meetPassword,
      onSubmitForm
    }
  }
})
</script>

<style scoped>

</style>