
<template>
  <fieldset>

    <legend>Auth Form</legend>

      <form @submit.prevent="onSubmit">

        <label> name <input type="text" v-model="userName"> </label>

        <label> is on audio <input type="checkbox" v-model="isAudioOn"> </label>

        <label> is on video <input type="checkbox" v-model="isVideoOn"> </label>

        <button type="button"  :disabled="isMeetPage && !!meetId" @click="onCreateMeet"> create meet </button>

        <button type="submit" :disabled="!meetId" >  meet  join req => {{ meetId }}</button>

      </form>

  </fieldset>

</template>

<script setup lang="ts">
import {useCurrentUser} from "@/features/useCurrentUser";
import {useMeet} from "@/components/meet/features/useMeet";
import { useRoute, useRouter} from "vue-router";
import {computed, ref, unref} from "vue";

const { userName,userId ,isAudioOn , isVideoOn , initUserStream , userIsAuth } = useCurrentUser()
const { createMeet , meetId , sendJoinMeetRequest }= useMeet()
const router = useRouter()
const route = useRoute()

const isMeetPage = computed(()=>{
  const { name } = unref(route)
  return name === 'MeetPage'
})

const onCreateMeet = async ()=> {

  if (!unref(userName)) {
    return
  }

  await createMeet()
}

const onSubmit = async () => {

  if (!unref(userName)) {
    return
  }

  // await initUserStream()

  await sendJoinMeetRequest()


  if (!unref(isMeetPage)) {
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