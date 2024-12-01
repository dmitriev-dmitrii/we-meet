
<template>

  <div class="meet-chat">
    <h2 style="text-align: center" >meet-chat</h2>
    <div class="meet-chat__messages__list">
      <div   class="meet-chat__messages__item" v-for="( { userName,message,sendTime }  , index) in chatMessagesFormatted" :key = index>

        {{userName}} : {{ message  }}   <span style="text-align: right"> sendTime : {{ sendTime }}</span>

      </div>
      <form @submit.prevent="submitMessage" class="meet-chat__form">
          <input type="text"  v-model='textMessage' class="meet-chat__form__input" placeholder="type a message...">
           <button type="submit"> submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">


import {ref, unref} from "vue";
import {useMeetChat} from "@/components/meet/chat/useMeetChat";
import {useMeetStore} from "@/store/useMeetStore";
const {  submitChatMessage , chatMessagesFormatted } = useMeetChat();

const meetStore = useMeetStore()
const textMessage = ref('')

const submitMessage = () =>{

  const text = unref( textMessage )

  if (!text) {
    return
  }

  submitChatMessage(text)
  textMessage.value = ''

}

// { userId , text , userName }

</script>


<style scoped>
.meet-chat{
  padding: 1rem;
  border: 1px solid currentColor;
  border-radius: 5px;
}
</style>
