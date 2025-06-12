<template>

  <CreateMeetForm/>

  <h1>MeetList</h1>
  <MeetList/>


</template>

<script>
import {defineComponent} from 'vue'
import CreateMeetForm from "@/components/CreateMeetForm.vue";

import MeetList from "@/components/MeetList/MeetList.vue";

export default defineComponent({
  name: "HomeView",
  components: {CreateMeetForm, MeetList},
  setup() {

    return {}
  }
})
</script>

<style scoped>

</style>