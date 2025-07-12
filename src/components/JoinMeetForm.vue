<template>
  <form @submit.prevent=" onSubmitForm">

    <label> name
      <input v-model="userName">
    </label>

    <label hidden> password
      <input v-model="meetPassword">
    </label>

    <button type="submit">
      join
    </button>
  </form>

</template>

<script>
import {defineComponent, onMounted, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";
import {useLocalUserStore} from "@/store/localUserStore.js";

export default defineComponent({
  name: "JoinMeetForm",
  setup() {
    const {localUserName} = useLocalUserStore()
    const {joinMeet} = useMeetStore()
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

    onMounted(() => {
      userName.value = unref(localUserName)
    })

    return {
      userName,
      meetPassword,
      onSubmitForm
    }
  }
})
</script>

<style scoped>

</style>