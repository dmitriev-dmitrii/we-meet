
<template>
  <div class="meet-chat">
    <div class="meet-chat__messages__list">
      <div class="meet-chat__messages__item" v-for="{ user_id ,text } in messagesList">
        {{user_id}} : {{text}}
      </div>
      <form @submit.prevent="submitMessage" class="meet-chat__form">
          <input type="text"  v-model='userMessage' class="meet-chat__form__input" placeholder="type a message...">
           <button type="submit"> submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useMeetChat} from "@/features/useMeetChat";

const {messagesList, submitMessage,userMessage} = useMeetChat()

</script>


<style scoped>

</style>
