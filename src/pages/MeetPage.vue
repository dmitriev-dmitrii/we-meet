<template>

<!--   <div v-if="!loading && !err">-->

<!--      <div v-if="!userId">-->
<!--        <AuthForm/>-->
<!--      </div>-->

<!--     <Meet v-if="userId && meetId" />-->

<!--   </div>-->

<!--  <div v-if="loading">-->
<!--    loading...-->
<!--  </div>-->

<!--  <div v-if="err">-->
<!--    err {{ err }}-->
<!--  </div>-->

  <AuthForm/>

  <Meet />

  <div v-if="err">
    err {{ err }}
  </div>

</template>

<style>

</style>
<script setup lang="ts">
import {onMounted, ref, unref, useTemplateRef} from "vue";
import {useRoute} from "vue-router";
import {useMeet} from "@/features/useMeet";
import {useCurrentUser} from "@/features/useCurrentUser";
import AuthForm from "@/components/AuthForm.vue";

import Meet from "@/components/meet/Meet.vue";

const { meetId, findMeetById  } =  useMeet()

const {userId} = useCurrentUser()

const route = useRoute()

const loading = ref(true)
const err = ref('')


onMounted(async ()=> {

  try {
    const { params } = unref(route)

    await findMeetById( params.id as string )

  } catch (error) {

    err.value = String(error)

  }
finally {
    loading.value = false
  }

})



</script>

<style>
.my-stream{
  border: dodgerblue 2px solid;
  border-radius: 5px;
}
</style>