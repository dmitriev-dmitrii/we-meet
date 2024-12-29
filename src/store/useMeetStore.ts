// @ts-nocheck
import axios from "axios";
import {computed, ref, unref} from "vue";
import {defineStore} from "pinia";

import {useUserStore} from "@/store/useUserStore";
import {useWebSocket} from "@/features/useWebSocket";
export const useMeetStore = defineStore('meetStore', () => {
    const { connectToWebSocket } = useWebSocket();
    const userStore = useUserStore()

    const meetId = ref('')
    const meetUsers = ref([])
    const meetUsersId = computed(()=> unref(meetUsers).map(({userId})=> userId))

    const meetChatMessages = ref([])
    const createMeet = async ()=> {

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet/create'

        const payload = {
            userName: userStore.userName,
            password:"",
            isPrivateMeet : false
        }

        const { data} = await axios.post(url, payload,{
            withCredentials: true
        })


        meetId.value = data.meetId

        return data
    }
    const sendJoinMeetRequest = async ()=> {
        const url = import.meta.env.VITE_WE_MEET_API_URL + `/api/meet/${unref(meetId)}/join-request`

        const payload = {
            userName: userStore.userName,
            password:''
        }

        const {data} = await axios.post(url, payload , {
            withCredentials: true
        })

        meetId.value = data.meetId
        meetChatMessages.value = data.meetChatMessages ?? []
        meetUsers.value = data.meetUsers

        const {user} = data

        userStore.userId = user.userId
        userStore.userName = user.userName

        await connectToWebSocket()

        // if (userStore.userId === data.meetOwnerId) {
        // await  createPeerOffer()
        // }

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
        meetUsersId,
        sendJoinMeetRequest,
        findMeetById,
        createMeet,
        meetUsers,
        meetId,
        meetChatMessages
    }
})
