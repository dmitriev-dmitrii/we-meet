
<template>
  <fieldset>

    <legend>Auth Form</legend>

      <form @submit.prevent="onJoinMeet">

        <label> name <input  v-model="userStore.userName"> </label>

        <button type="button"   @click="onCreateMeet"> create meet </button>

        <button type="submit" :disabled="!meetStore.meetId" >  meet  join req </button>

      </form>

  </fieldset>

</template>

<script setup lang="ts">

import {useMeetStore} from "@/store/useMeetStore";
import {useUserStore} from "@/store/useUserStore";
import { useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref, unref} from "vue";
import adapter from "webrtc-adapter";

const userStore = useUserStore()
const meetStore = useMeetStore()
const router = useRouter()
const route = useRoute()


const isMeetPage = computed(()=> {
  const { name } = unref(route)
  return name === 'MeetPage'
})

const onCreateMeet = async ()=> {

 const { meetId } = await meetStore.createMeet()

  if (!unref(isMeetPage)) {
    await router.push({ name:'MeetPage', params:{ id: meetId }})
  }

}

const onJoinMeet = async () => {

  await meetStore.sendJoinMeetRequest()

  if (!unref(isMeetPage)) {
    await router.push({ name:'MeetPage', params:{ id: unref(meetStore.meetId) }})
  }

}

onMounted(()=> {
  // todo focus on input form
    userStore.userName = adapter.browserDetails.browser
})

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