import axios from "axios";
import {ref, unref} from "vue";
import {useCurrentUser} from "@/features/useCurrentUser";
import {useWebSocket} from "@/features/useWebSocket";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";
import {useWebRTC} from "@/features/useWebRTC";

const   { userName,userId, userAuth } = useCurrentUser()
const {sendWebSocketMessage} = useWebSocket()
const {createPeerOffer} = useWebRTC()
const meetId = ref('')
const meetUsers = ref([])
const meetChatMessages = ref([])
const meetOwnerId = ref('')
export const useMeet = () => {
    const createMeet = async ()=> {

    await userAuth()
    const rtcOffer = await   createPeerOffer()
    const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/create'

    const payload = {
            userName: unref(userName),
            userId: unref(userId),
            rtcOffer
    }

    const { data} = await axios.post(url, payload,{
        withCredentials: true
    })

    meetOwnerId.value =  data.meetOwnerId
    meetId.value = data.meetId

    return data
    }
    const sendJoinMeetRequest = async ()=> {

    await userAuth()

    const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/join-request'

    const payload = {
           meetId : unref(meetId)
    }

    const {data} = await axios.post(url, payload , {
        withCredentials: true
    })

    meetId.value = data.meetId
    meetChatMessages.value = data.meetChatMessages

    }

    const findMeetById = async (id='')=> {

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/' + id

        const {data} = await axios.get(url,{
            withCredentials: true
        })

        meetId.value = data.meetId

        return data
    }

   const  submitChatMessage = async (text = '')=> {

        if (!text) {
            return
        }

       const payload = {
           type:  MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE,
           // data : {
           //     meetId :unref( meetId ) ,
           //     userName : unref(userName),
           //     userId : unref(userId),
           //     text
           // },
           meetId :unref( meetId ) ,
           userName : unref(userName),
           userId : unref(userId),
           text
       }

      sendWebSocketMessage(payload)
    }

    const  meetChatMessageHandle = (message:any)=> {
        //@ts-ignore
        meetChatMessages.value.push(message)
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
        meetChatMessages.value.push(  {  type, userName , userId , text } )

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
        meetChatMessages.value.push(  {  type, userName , userId , text } )

    }

    return {
        userLeaveMeetHandle,
        sendJoinMeetRequest,
        userJoinMeetHandle,
        meetChatMessages,
        submitChatMessage,
        meetChatMessageHandle,
        findMeetById,
        createMeet,
        meetUsers,
        meetId,
        meetOwnerId
    }
}