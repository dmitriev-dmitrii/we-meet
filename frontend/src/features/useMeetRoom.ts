import {ref, unref} from "vue";
import {useRoute} from "vue-router";
import {useWebSocket} from "@/features/useWebSocket";
import {useCurrentUser} from "@/features/useCurrentUser";

const roomId = ref(123)
const creatorUserId = ref(0)
const meetUsers = ref([])

const {addWebSocketMessageHandlers,sendWebSocketMessage} = useWebSocket()
const {userId,name} = useCurrentUser()
export const useMeetRoom = ()=> {
    const route = useRoute()

    const createMeetRoom = async ()=> {

    sendWebSocketMessage({ type: 'create-room', roomId: roomId.value, userId:unref(userId), name:unref(name) })

    creatorUserId.value = unref(userId)

    return roomId.value
    }

const getRoomByRoomId = async ()=> {

}


const joinRoom = ()=> {

    sendWebSocketMessage({ type: 'join', roomId: unref(roomId) , userId:unref(userId), name:unref(name) })

    meetUsers.value.push({userId:unref(userId), name:unref(name)})

    console.log('join room meetUsers',unref(meetUsers))
}

    // const events = [
    //     {
    //         type: 'join',
    //         callback: userConnectedHandle
    //     },
    // ]
    //
    // addWebSocketMessageHandlers(events)


    if ( !unref(roomId) && unref(route)?.params?.roomId ) {
        roomId.value = parseInt( params.roomId, 10)
    }


    return {
        creatorUserId,
        meetUsers,
        getRoomByRoomId,
        createMeetRoom,
        joinRoom,
        roomId
    }
}