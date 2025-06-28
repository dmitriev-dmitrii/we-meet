import {meetApi} from "@/api/meetApi.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore, useLocalUserStore} from "@/store/localUserStore.js";
import {useWebSocket} from "@/features/useWebSocket.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {peerConnections} from "@/store/webRtcStore.js";
import {reactive, ref, unref} from "vue";

const remoteUsersMap = reactive({})
const currentMeetId = ref('')

const {sendMeOffer} = useWebRtcConnections()

const {closeWebSocket, connectToWebSocket} = useWebSocket()

const {
    closeDataChanel
} = useWebRtcDataChannels()

const {
    deleteMediaStream,
} = useWebRtcMediaStreams()

const {
    closePeerConnection
} = useWebRtcConnections()

const {localUserId} =  useLocalUserStore()
const createMeet = async ({password}) => {
    try {
        await localUserStore.auth()

        const payload = {
            userName: localUserStore.userName,
            userId: localUserStore.userId,
            password
        }
        const {data} = await meetApi.createMeet(payload)

        return data

    } catch (e) {
        alert('createMeet err' + e.message)
        throw e
    }
}

const joinMeet = async () => {
    try {

        await localUserStore.auth()
        await webRtcStore.fetchIceServers()

        const {meetId} = meetStore
        const {userId} = localUserStore

        const {data} = await meetApi.joinMeetRequest({meetId, userId})

        await connectToWebSocket({meetId, userId})
        await sendMeOffer()

    } catch (e) {

        alert('joinMeet err' + e.message)
        throw e
    }

}
const leaveMeet = () => {
    try {
        meetStore.meetId = ''

        Object.keys(peerConnections).forEach((remoteUserId) => {
            removeUserFromMeet(remoteUserId)
        })

        closeWebSocket()

    } catch (e) {
        alert('leaveMeet err' + e.message)
        throw e
    }
}

const removeUserFromMeet = (remoteUserId) => {

    deleteMediaStream(remoteUserId)
    closeDataChanel(remoteUserId)
    closePeerConnection(remoteUserId)

    remoteUsersMap[remoteUserId] = undefined
}

const findMeetById = async (meetId) => {

    const {data} = await meetApi.getMeetById({meetId})

    meetStore.meetId = data.meetId

    currentMeetId.value = data.meetId
    return data

}


const updateMeetUser = (payload) => {

    if (payload.userId === unref(localUserId)) {
      return
    }

    if (!payload.peerStatus) {
        payload.peerStatus = peerConnections[payload.userId]?.connectionState
    }

    remoteUsersMap[payload.userId] = { ...remoteUsersMap[payload.userId] , ...payload }

}

export const useMeetStore = () => {

    return {
        currentMeetId,
        remoteUsersMap,
        updateMeetUser,
        removeUserFromMeet
    }

}

export const meetStore = {
    meetId: '',
    findMeetById,
    removeUserFromMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}


