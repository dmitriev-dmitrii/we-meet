

<template>
  <fieldset>

    <legend>Auth Form</legend>

      <form @submit.prevent="onSubmit">

          <label> name <input type="text" v-model="userName"> </label>

        <label> is on audio <input type="checkbox" v-model="isAudioOn"> </label>

        <label> is on video <input type="checkbox" v-model="isVideoOn"> </label>

        <button type="button"  @click="onCreateMeet"> create meet </button>

        <button type="submit" :disabled="!meetId" > to meet => {{ meetId }}</button>

      </form>

  </fieldset>



</template>

<script setup lang="ts">
import {useCurrentUser} from "@/features/useCurrentUser";
import {useMeet} from "@/features/useMeet";
import { useRoute, useRouter} from "vue-router";
import {ref, unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";



const { userName,userId ,isAudioOn , isVideoOn , initUserStream , userAuth} = useCurrentUser()
const { createMeet , meetId , sendJoinMeetRequest }= useMeet()
const router = useRouter()
const {sendWebSocketMessage} = useWebSocket()
const route = useRoute()


const onCreateMeet = async ()=> {

  // if (!unref(userName)) {
  //   return
  // }


  await createMeet()

  const { name } = unref(route)

  if (name === 'MeetPage') {
    await router.replace({ name:'MeetPage', params:{ id: unref(meetId) }})
  }
}

const onSubmit = async () => {
  //
  // if (!unref(userName)) {
  //   return
  // }

  await sendJoinMeetRequest()

  // await initUserStream()

  const { name } = unref(route)

  if (name !== 'MeetPage') {
    await router.push({ name:'MeetPage', params:{ id: unref(meetId) }})
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