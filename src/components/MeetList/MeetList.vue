<template>
  <MeetListItem v-for="item in meetsList" :key="item.id"/>
</template>

<script>
import {defineComponent,onMounted } from 'vue'
import MeetListItem from "@/components/MeetList/MeetListItem.vue";
import {useMeetsListStore} from "@/store/useMeetsListStore.ts";

export default defineComponent({
  name: "MeetList",
  components: {MeetListItem},

  setup() {

    const {
      meetsList,
      fetchMeetsList
    } = useMeetsListStore()

  onMounted(()=>{
    fetchMeetsList()
  })
    return {
      meetsList
    }
  }
})
</script>

<style scoped>

</style>