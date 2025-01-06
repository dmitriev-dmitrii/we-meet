// @ts-nocheck
import {computed, ref, unref} from "vue";
import {WEB_SOCKET_EVENTS} from "@/constatnts/WebSocketEvents";

import {useWebSocket} from "@/features/useWebSocket";
import {useMeetStore} from "@/store/useMeetStore";


export const useMeetChat = () => {

    const {sendWebSocketMessage} = useWebSocket()
    const meetStore = useMeetStore()

   const  submitChatMessage = async (text = '')=> {

        if (!text) {
            return
        }

       const payload = {
           // type:  WEB_SOCKET_EVENTS.CHAT_MESSAGE,
           data: {
               text
           }
       }

      sendWebSocketMessage(payload)
    }

    const  meetChatMessageHandle = (message:any)=> {
        //@ts-ignore
        meetStore.meetChatMessages.push(message)
    }
    //@ts-ignore
    const  userJoinMeetHandle = ( payload )=> {

        const {
            type,
            userName ,
            userId ,
            text,
        } = payload
        //@ts-ignore
        meetStore.meetChatMessages.push(  {  type, userName , userId , text } )

    }
        //@ts-ignore
    const  userLeaveMeetHandle = ( payload)=> {

        const {
            type,
            userName ,
            userId ,
            text,
        } = payload
        //@ts-ignore
        meetStore.meetChatMessages.push(  {  type, userName , userId , text } )

    }


    const chatMessagesFormatted = computed(()=>{
      return   meetStore.meetChatMessages.map(( { data , createdAt , userName } )=> {

           const sendTime =   new Date(createdAt).toLocaleTimeString('ru-RU', {hour: 'numeric', minute: 'numeric'})


            return {
                userName,
                sendTime,
                message : data?.text
            }
        })
    })

    return {
        chatMessagesFormatted,
        userLeaveMeetHandle,
        userJoinMeetHandle,
        submitChatMessage,
        meetChatMessageHandle,
    }
}