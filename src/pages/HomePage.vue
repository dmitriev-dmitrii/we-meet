

<template>
  <main>
    <h1>We meet!</h1>
    <form @submit.prevent="submitForm">
    <input v-model="name" type="text" placeholder="enter you name">
      <button> lets talk!  </button>
    </form>
    <video ref="currentUserLocalVideo"  autoplay muted></video>
  </main>
</template>

<script setup lang="ts">
import {useCurrentUser} from "@/features/useCurrentUser";
import {onMounted, unref, useTemplateRef} from "vue";
import {useMeetRoom} from "@/features/useMeetRoom";
import router from "@/router";

const  { name , userStream , initUserStream} = useCurrentUser()
const  { createMeetRoom } = useMeetRoom()


const submitForm = async ()=> {

  if (!unref(name)) {
    return
  }


if (unref(name) === 'chrome') {
  const id = await createMeetRoom()
}
  await router.push( {name:'MeetPage', params : { id :  123} } )

}

const abc = useTemplateRef('currentUserLocalVideo')


onMounted( async ()=> {

  const videoTag = unref(abc)

   await initUserStream()
  //@ts-ignore
  videoTag.srcObject = unref(userStream)

})





</script>