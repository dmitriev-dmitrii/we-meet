
<template>
  <fieldset>

    <legend>Auth Form</legend>

      <form @submit.prevent="onSubmit">

        <label> name <input type="text" v-model="userName"> </label>

        <button type="button"  :disabled="isMeetPage && !!meetStore.meetId" @click="onCreateMeet"> create meet </button>

        <button type="submit" :disabled="!meetStore.meetId" >  meet  join req => {{ meetStore.meetId }}</button>

      </form>

  </fieldset>

</template>

<script setup lang="ts">

import {useMeetStore} from "@/store/useMeetStore";
import {useUserStore} from "@/store/useUserStore";
import { useRoute, useRouter} from "vue-router";
import {computed, ref, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import adapter from "webrtc-adapter";

const { connectToWebSocket } = useWebSocket()
const userStore = useUserStore()
const meetStore = useMeetStore()
const router = useRouter()
const route = useRoute()

const userName = ref(adapter.browserDetails.browser)

const isMeetPage = computed(()=> {
  const { name } = unref(route)
  return name === 'MeetPage'
})


const onCreateMeet = async ()=> {

  await userStore.sendAuthRequest({userName : unref(userName)})
  await meetStore.createMeet()

}

const onSubmit = async () => {

  await userStore.sendAuthRequest({userName : unref(userName)})

  await meetStore.sendJoinMeetRequest()

  if (!unref(isMeetPage)) {
    await router.push({ name:'MeetPage', params:{ id: unref(meetStore.meetId) }})
  }

}

</script>

<style scoped>

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  fieldset {
    border-radius: 5px;
  }
</style>