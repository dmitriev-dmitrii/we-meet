

<template>
  <h2> current user :{{userName}}</h2>
  <h2>  userId: {{userId}}</h2>
  <div>meetUsers {{meetUsers.length}}</div>
  <MeetChat/>

    <div ref="videosGridContainer" class="videos-grid-container">

    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, unref, useTemplateRef} from "vue";

import {useMeet} from "@/features/useMeet";

import {useCurrentUser} from "@/features/useCurrentUser";
import MeetChat from "@/components/meet/MeetChat.vue";

const {meetUsers } =  useMeet()

const {userId, userName , userAuth} = useCurrentUser()

const videosGridContainer = useTemplateRef('videosGridContainer')



</script>

<style scoped>

</style>