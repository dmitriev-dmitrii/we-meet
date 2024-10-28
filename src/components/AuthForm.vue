

<template>
  <fieldset>

    <legend>Auth Form</legend>

      <form @submit.prevent="onSubmit">

          <label> name <input type="text" v-model="userName"> </label>

        <label> is on audio <input type="checkbox" v-model="isAudioOn"> </label>

        <label> is on video <input type="checkbox" v-model="isVideoOn"> </label>

        <button type="button" :disabled="!!meetId" @click="createMeet"> create meet </button>

        <button type="submit" :disabled="!meetId"> to meet => {{ meetId }}</button>

      </form>

  </fieldset>



</template>

<script setup lang="ts">
import {useCurrentUser} from "@/features/useCurrentUser";
import {useMeet} from "@/features/useMeet";
import {RouterLink, useRouter} from "vue-router";
import {unref} from "vue";
import {useWebSocket} from "@/features/useWebSocket";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";

const { userName,userId ,isAudioOn , isVideoOn , initUserStream , saveUser} = useCurrentUser()
const { createMeet , meetId }= useMeet()
const router = useRouter()
const {sendWebSocketMessage} = useWebSocket()

const onSubmit = async () => {

  if (!unref(userName)) {
    return
  }

  await saveUser()

  // await initUserStream()

    const message = {
      type:  MEET_WEB_SOCKET_EVENTS.USER_ENTER_MEET,
      meetId :unref( meetId ) ,
      userName : unref(userName),
      userId : unref(userId)

    }

    sendWebSocketMessage(message);

  await router.push({ name:'MeetPage', params:{ id:unref(meetId) }})
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