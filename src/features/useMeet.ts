import axios from "axios";
import {ref, unref} from "vue";
import {useCurrentUser} from "@/features/useCurrentUser";
import {useWebSocket} from "@/features/useWebSocket";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";
const {sendWebSocketMessage} = useWebSocket()

const   {userName,userId} = useCurrentUser()

const meetId = ref('')
const meetUsers = ref([])
const meetChatMessages = ref([])

export const useMeet = () => {
    const createMeet = async ()=> {

    const url = 'http://localhost:3000/api/meet/create'

    const payload = {

        userName: unref(userName),
        userId: unref(userId)
    }

    const {data} = await axios.post(url, payload)

    meetId.value = data.meetId
    meetUsers.value = data.meetUsers

    return data
    }

    const findMeetById = async (id='')=> {

        const url = 'http://localhost:3000/api/meet/' + id

        const {data} = await axios.get(url)

        meetUsers.value = data.meetUsers

        meetId.value = data.meetId
        meetChatMessages.value = data.meetChatMessages

        return data
    }

   const  submitChatMessage = (text = '')=> {

        if (!text) {
            return
        }

       const payload = {
           type:  MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE,
           meetId :unref( meetId ) ,
           userName : unref(userName),
           userId : unref(userId),
           text
       }

       sendWebSocketMessage(payload)
    }

    const  meetChatMessageHandle = (message:any)=> {
        meetChatMessages.value.push(message)
    }

    return {
        meetChatMessages,
        submitChatMessage,
        meetChatMessageHandle,
        findMeetById,
        createMeet,
        meetUsers,
        meetId
    }
}