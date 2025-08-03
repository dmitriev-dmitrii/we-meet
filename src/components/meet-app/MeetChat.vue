<template>
  <div class="meet-chat">
    <ul class="meet-chat__messages">
      <li v-for="item in messages">{{ item }}</li>
    </ul>

    <form @submit.prevent="onSubmitForm" class="meet-chat__form">

      <UiTextInput v-model="textMessage" size="small" placeholder="write message"/>
      <UiButton size="small" type="submit">
        send
      </UiButton>
    </form>
  </div>
</template>

<script>
import {defineComponent, ref, unref} from 'vue'

import {useLocalUserStore} from "@/store/localUserStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";

import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {useEventBus} from "@vueuse/core";
import UiButton from "@/components/ui/UiButton.vue";
import UiTextInput from "@/components/ui/UiTextInput.vue";


export default defineComponent({
  name: "MeetChat",
  components: {UiTextInput, UiButton},
  setup() {
    const {localUserName} = useLocalUserStore();
    const {sendDataChanelMessage} = useWebRtcDataChannels();

    const textMessage = ref('')
    const messages = ref([])


    const printChatMessage = ({userName, text}) => {
      messages.value.push(`[${userName}] : ${text}`)
    }
    const onDataChanelOpen = ({fromUser}) => {

      const {userName} = fromUser
      const text = 'data chanel open'

      printChatMessage({userName, text})
    }

    const onDataChanelClose = ({fromUser}) => {

      const {userName} = fromUser

      const text = 'data chanel closed'

      printChatMessage({userName, text})
    }

    const onDataChanelTextMessage = ({data, fromUser}) => {

      const {userName} = fromUser
      const {text} = data

      printChatMessage({userName, text})
    }


    const onSubmitForm = async (e) => {
      e.preventDefault()

      const text = unref(textMessage)

      if (!text) {
        return
      }

      const payload = {
        type: WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_TEXT_MESSAGE,
        data: {
          text,
        }
      }

      sendDataChanelMessage(payload) //TODO проверить всем ли доставлено

      printChatMessage({userName: unref(localUserName), text})

      textMessage.value = '';
    }

    const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE)

    webRtcEventBus.on((payload) => {

      const {type} = payload

      if (type === WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_TEXT_MESSAGE) {
        onDataChanelTextMessage(payload)
      }

      if (type === WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_OPEN) {
        onDataChanelOpen(payload)
      }

      if (type === WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_CLOSE) {
        onDataChanelClose(payload)
      }

    })

    return {
      messages,
      textMessage,
      onSubmitForm
    }
  }
})
</script>

<style scoped lang="scss">
.meet-chat {
  display: flex;
  flex-direction: column;
  &__messages{

  }
  &__form {
    display: flex;
  }
}
</style>