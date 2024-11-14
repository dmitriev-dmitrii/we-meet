<template>

    <AuthForm/>

</template>

<script setup lang="ts">

import {useMeet} from "@/components/meet/features/useMeet";
import AuthForm from "@/components/AuthForm.vue";
import {onMounted} from "vue";



const {meetId} = useMeet()
onMounted(()=>{
  meetId.value=''
})
</script>

