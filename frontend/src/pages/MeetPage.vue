<template>

    <h1>Meet </h1>
<!--    <MeetChat/>-->
 <h2>creatorUserId : {{creatorUserId}}</h2>
<h2>  currentMediaConnections {{ currentMediaConnections.length }}</h2>

  <div ref="videosContainer" class="videos-container">

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

const {roomId ,meetUsers , creatorUserId} =  useMeetRoom()
const  { name , initUserStream, userStream} = useCurrentUser()

const {
  currentMediaConnections
} = usePeerConnection( )


const videosContainer = useTemplateRef('videosContainer')
const streamsIdArr = []

const appendVideo =  (mediaStream, isMyStream = false )=> {
  const { id } = mediaStream

  if  (streamsIdArr.includes(id)) {

    return
  }

  streamsIdArr.push(id)
  const video = document.createElement("video");
  video.srcObject = mediaStream

  unref(videosContainer).append(video)
  if (isMyStream) {
    video.classList.add('my-stream')
  }

  video.play()
}



watch (currentMediaConnections, (val) => {

  val.forEach((item)=>{
    appendVideo(item)
  })

},{deep:true} )

onMounted(async ()=> {

  unref(currentMediaConnections).forEach((item)=> {
    appendVideo(item)
  })

  if (unref(userStream)) {
    appendVideo(unref(userStream),true)
    currentMediaConnections.value.push(unref(userStream))
  }
})


// stopVideo.addEventListener("click", () => {
//   const enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     html = `<i class="fas fa-video-slash"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   } else {
//     myVideoStream.getVideoTracks()[0].enabled = true;
//     html = `<i class="fas fa-video"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   }
// });

</script>

<style>
.my-stream{
  border: dodgerblue 2px solid;
  border-radius: 5px;
}
</style>