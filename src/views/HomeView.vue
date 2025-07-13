<template>
  <h1 :class="{  'mounted' : mounted }">
    We Meet
  </h1>

    <CreateMeetForm/>

</template>

<script>
import {defineComponent, onMounted, ref} from 'vue'
import CreateMeetForm from "@/components/meet-form/CreateMeetForm.vue";

export default defineComponent({
  name: "HomeView",
  components: {CreateMeetForm,},
  setup() {

    const mounted = ref(false)

    onMounted(async () => {
      mounted.value = true
    })
    return {
      mounted
    }
  }
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: 10rem;
  letter-spacing: -15rem;
  //min-height: 15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  opacity: 0;
}

h1.mounted {
  text-align: center;
  white-space: nowrap;
  transition: letter-spacing 0.4s 0.5s ease, opacity 0.3s 0.5s linear, font-size 0.3s 1.3s;
  letter-spacing: 0;
  font-size: 5rem;
  opacity: 1;
  max-width: 100%;
  overflow: hidden;
}
</style>