<template>

    <h1>Meet </h1>
<!--    <MeetChat/>-->
<h2>creatorUserId : {{creatorUserId}}</h2>
  <div ref="videoTagsContainer" >
  </div>

  <div v-for="{name,userId} in meetUsers" :key="userId">
    <hr/>
    name : {{name}} , <br/>
    userId :{{userId}}

  </div>
</template>

<style>

</style>
<script setup lang="ts">
import MeetChat from "@/components/meet/MeetChat.vue";
import {useMeetRoom} from "@/features/useMeetRoom";
import {useCurrentUser} from "@/features/useCurrentUser";
import {useRoute} from "vue-router";
import {onBeforeMount, onMounted, unref, useTemplateRef, watch} from "vue";
import {usePeerConnection} from "@/features/usePeerConnection";
import {useWebSocket} from "@/features/useWebSocket";
import router from "@/router";

const {roomId, joinRoom ,meetUsers , creatorUserId} =  useMeetRoom()
const  { name , initUserStream, userStream} = useCurrentUser()
const {connectWebSocket} = useWebSocket()
const {createPeerConnection} = usePeerConnection()

const videoContainer = useTemplateRef('videoContainer')
watch( meetUsers, (value, oldValue, onCleanup) => {

  // const video = document.createElement("video");
  // video.srcObject = value[value.length]['userStream'];
  // unref(videoContainer).append(video)
  // video.play()

})

// if (!unref(roomId)) {
//   router.push({name:'HomePage'})
// }

onMounted(async ()=> {

  if (!unref(userStream)) {
    await initUserStream()
  }


  await createPeerConnection()
  joinRoom()

})

</script>