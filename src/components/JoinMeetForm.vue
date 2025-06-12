<template>
  JoinMeetForm
</template>

<script>
import {defineComponent, ref, unref} from 'vue'


export default defineComponent({
  name: "JoinMeetForm",
  setup() {

    const meetPassword = ref('')
    const isLoading = ref(false)

    // const joinMeet = async () => {
    //   try {
    //     isLoading.value = false
    //     await meetStore.joinMeet()
    //   } catch (e) {
    //     console.error('create meet form joinMeet', e)
    //   } finally {
    //     isLoading.value = false
    //   }
    // }

    // const copyMeetHref = async () => {
    //   console.log('copyMeetHref', window.location.href)
    // }
    //
    // const onActionBarClick = async (e) => {
    //
    //   const eventTarget = e.target
    //   e.stopPropagation()
    //   const {actionType} = eventTarget.dataset
    //
    //   if (!Object.values(CREATE_MEET_FORM_ACTION_BAR_MAP).includes(actionType)) {
    //     return
    //   }
    //
    //   if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.CREATE_MEET) {
    //     await createMeet()
    //     return;
    //   }
    //
    //   if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.COPY_MEET_LINK) {
    //     await copyMeetHref()
    //   }
    //
    //   if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.GO_TO_MEET) {
    //     await joinMeet()
    //   }
    // }

    return {}
  }
})
</script>

<style scoped>

</style>