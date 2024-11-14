

<template>

  <MeetChat  v-if="userIsAuth" />

<!--    <div ref="videosGridContainer" class="videos-grid-container">-->

<!--    </div>-->
</template>

<script setup lang="ts">
import {onMounted, ref, unref, useTemplateRef} from "vue";

import {useMeet} from "@/components/meet/features/useMeet";

import {useCurrentUser} from "@/features/useCurrentUser";
import MeetChat from "@/components/meet/MeetChat.vue";

const {meetUsers } =  useMeet()

const {userId, userName , userAuth , userIsAuth} = useCurrentUser()

// const videosGridContainer = useTemplateRef('videosGridContainer')




</script>

<style scoped>

</style>