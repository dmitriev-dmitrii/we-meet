<template>

  <button>
    join
  </button>

</template>

<script>
import {defineComponent, ref, unref} from 'vue'


export default defineComponent({
  name: "JoinMeetForm",
  setup() {

    const meetPassword = ref('')
    const isLoading = ref(false)

    return {

    }
  }
})
</script>

<style scoped>

</style>