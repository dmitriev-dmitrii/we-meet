
<template>

  <div class="meet-chat">
    <h2 style="text-align: center" >meet-chat</h2>
    <div class="meet-chat__messages__list">
      <div  class="meet-chat__messages__item" v-for="( { text , userName }  , index) in meetChatMessages" :key = index>
        {{userName}} : {{text}}
      </div>
      <form @submit.prevent="submitMessage" class="meet-chat__form">
          <input type="text"  v-model='textMessage' class="meet-chat__form__input" placeholder="type a message...">
           <button type="submit"> submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useMeet} from "@/features/useMeet";
import {ref, unref} from "vue";

const {meetChatMessages,meetChatMessageHandle,submitChatMessage} = useMeet()

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
