<template>
<form @submit.prevent="onSubmitForm" style="display: flex;flex-direction: column">

  <label v-if="!meetId"> password
    <input  v-model="meetPassword">
  </label>

  <button type="submit"  v-if="!meetId">
    create meet
  </button>

  <button type="button" @click="copyMeetHref" v-if="meetId">
    copy meet link
  </button>

  <button type="button" @click="toMeet" v-if="meetId">
    to meet =>
  </button>
</form>


</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {useMeetStore} from "@/store/meetStore.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "CreateMeetForm",
  setup() {
    const {createMeet}= useMeetStore()
    const router = useRouter()
    const meetPassword = ref('')
    const meetId = ref('')

    const copyMeetHref = async () => {
      console.log('copyMeetHref', window.location.href)
    }

    const toMeet = async ()=>{
      await router.push( { name:'MeetView' , params:{meetId:unref(meetId)} })
    }

    const onSubmitForm = async () => {

     const res  =  await createMeet({password:unref(meetPassword)})

     meetId.value = res.meetId

    }

    return {
      meetId,
      meetPassword,
      onSubmitForm,
      copyMeetHref,
      toMeet
    }
  }
})
</script>

<style scoped>

</style>