// @ts-nocheck
import axios from "axios";
import {ref, unref} from "vue";
import {defineStore} from "pinia";
import {useWebRTC} from "@/features/useWebRTC";
import {useUserStore} from "@/store/useUserStore";

export const useMeetStore = defineStore('meetStore', () => {
    const {createPeerOffer} = useWebRTC()
    const userStore = useUserStore()

    const meetId = ref('')
    const meetUsers = ref([])
    const meetOwnerId = ref('')
    const meetChatMessages = ref([])

    const createMeet = async ()=> {


        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/create'

        const rtcOffer = await   createPeerOffer()

        const payload = {
            rtcOffer,
            userId: userStore.userId
        }

        const { data} = await axios.post(url, payload,{
            withCredentials: true
        })

        meetOwnerId.value =  data.meetOwnerId
        meetId.value = data.meetId

        return data
    }
    const sendJoinMeetRequest = async ()=> {

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/join-request'

        const payload = {
            meetId : unref(meetId),
            userId: userStore.userId
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



    return {
        sendJoinMeetRequest,
        findMeetById,
        createMeet,
        meetUsers,
        meetId,
        meetOwnerId,
        meetChatMessages
    }
})
