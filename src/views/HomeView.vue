<template>

  <CreateMeetForm/>


</template>

<script>
import {defineComponent} from 'vue'
import CreateMeetForm from "@/components/CreateMeetForm.vue";

export default defineComponent({
  name: "HomeView",
  components: {CreateMeetForm, },
  setup() {

    return {

    }
  }
})
</script>

<style scoped>

</style>