<template>
  <ul data-role="messages-list">
    <li v-for="item in messages">{{item}}</li>
  </ul>

  <form @submit.prevent="onSubmitForm">
    <label>
      <input v-model="textMessage" type="text" placeholder="write message">
    </label>

    <button type="submit">
      send
    </button>
  </form>
</template>

<script>
import {defineComponent, ref, unref} from 'vue'
import {BUS_EVENTS, DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {localUserStore} from "@/store/localUserStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useEventBus} from "@/features/useEventBus.js";

export default defineComponent({
  name: "MeetChat",
  setup() {
    const {listenEvent} = useEventBus()

    const textMessage = ref('')
    const messages = ref([])


    const {sendDataChanelMessage} = useWebRtcDataChannels();
    const printChatMessage = ({userName, text}) => {
      messages.value.push(`[${userName}] : ${text}`)
    }
    const onDataChanelOpen = (eventData) => {

      const {remoteUserName} = eventData

      const text = 'data chanel open'

      printChatMessage({userName: remoteUserName, text})
    }

    const onDataChanelClose = (eventData) => {

      const {remoteUserName} = eventData

      const text = 'data chanel closed'

      printChatMessage({userName: remoteUserName, text})
    }

    const onDataChanelTextMessage = (eventData) => {
      const {data, type, fromUserName} = eventData

      if (type !== DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE) {
        return
      }

      const {text} = data

      printChatMessage({userName: fromUserName, text})
    }


    const onSubmitForm = async (e) => {
      e.preventDefault()

      const text = unref(textMessage)

      if (!text) {
        return
      }

      const payload = {
        type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE,
        data: {
          text,
        }
      }

      sendDataChanelMessage(payload)


      printChatMessage({userName: localUserStore.userName, text})

      textMessage.value = '';
    }



    listenEvent(BUS_EVENTS.DATA_CHANEL_TEXT_MESSAGE, onDataChanelTextMessage)
    listenEvent(BUS_EVENTS.DATA_CHANEL_OPEN, onDataChanelOpen)
    listenEvent(BUS_EVENTS.DATA_CHANEL_CLOSE, onDataChanelClose)

    return {
      messages,
      textMessage,
      onSubmitForm
    }
  }
})
</script>

<style scoped>

</style>