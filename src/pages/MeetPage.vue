

<template>

  <div class="meet">
    <h1>meet</h1>
    <MeetChat/>

  </div>

</template>
<script>



import {defineComponent} from "vue";
import MeetChat from "../components/meet/MeetChat.vue";

export default defineComponent ({
  name:'MeetPage',
  components: {MeetChat},
  setup(){


    return {


    }
  }
})

</script>
<style scoped>

</style>