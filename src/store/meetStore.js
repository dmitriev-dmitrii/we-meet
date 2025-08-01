import {WEB_RTC_EVENT_BUS_INSTANCE, WEB_RTC_EVENT_BUS_TYPES} from "@/constants/event-bus.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {useLocalUserStore} from "@/store/localUserStore.js";
import {useWebSocket} from "@/features/useWebSocket.js";
import {reactive, ref, unref} from "vue";
import {createGlobalState, useEventBus} from "@vueuse/core";
import {meetApi} from "@/api/meetApi.js";

const {closeWebSocket, connectToWebSocket} = useWebSocket()
const {closePeerConnection} = useWebRtcConnections()
const {deleteMediaStream} = useWebRtcMediaStreams()
const {closeDataChanel} = useWebRtcDataChannels()
const {sendMeOffer} = useWebRtcConnections()

export const useMeetStore = createGlobalState(() => {

    const webRtcEventBus = useEventBus(WEB_RTC_EVENT_BUS_INSTANCE)
    const {localUserId, auth} = useLocalUserStore()

    const currentMeetId = ref('')
    const isPrivateMeet = ref(false)
    const remoteUsersMap = reactive({})
    const findMeetById = async (meetId) => {

        const {data} = await meetApi.getMeetById({meetId})

        isPrivateMeet.value = data.ownerUserId === localUserId ? false : data.isPrivateMeet

        currentMeetId.value = data.meetId
        return data

    }
    const updateMeetUser = (payload) => {


        if (payload.userId === unref(localUserId) || !payload.userId) {
            return
        }
        //
        // const defaultUserFields = {
        //
        // }
        //

        remoteUsersMap[payload.userId] = {...remoteUsersMap[payload.userId], ...payload}

    }

    const setCurrentMeet = (meetId) => {
        currentMeetId.value = meetId
    }

    const removeUserFromMeet = (remoteUserId) => {

        deleteMediaStream(remoteUserId)
        closeDataChanel(remoteUserId)
        closePeerConnection(remoteUserId)

        remoteUsersMap[remoteUserId] = undefined
    }

    const createMeet = async ({password}) => {
        try {
            const {userId} = await auth()

            const payload = {
                userId,
                password
            }

            const {data} = await meetApi.createMeet(payload)

            return data

        } catch (e) {
            alert('createMeet err' + e.message)
            throw e
        }
    }

    const joinMeet = async ({userName, password}) => {

        try {

            await auth({userName})

            const payload = {
                meetId: unref(currentMeetId),
                userId: unref(localUserId)
            }

            const {data} = await meetApi.joinMeetRequest({...payload, ...{password}})

            await connectToWebSocket(payload)

            await sendMeOffer()

        } catch (e) {

            alert('joinMeet err ' + e.message)
            throw e
        }

    }
    const leaveMeet = () => {
        try {
            Object.keys(unref(remoteUsersMap)).forEach((remoteUserId) => {
                removeUserFromMeet(remoteUserId)
            })

            closeWebSocket()

        } catch (e) {
            alert('leaveMeet err' + e.message)
            throw e
        }
    }

    webRtcEventBus.on((payload) => {

        const {type, data, fromUser} = payload

        if (type === WEB_RTC_EVENT_BUS_TYPES.DATA_CHANEL_MEDIA_TRACK_STATE || type === WEB_RTC_EVENT_BUS_TYPES.PEER_UPDATE_STATUS) {

            updateMeetUser({...fromUser, ...data})
        }

    })


    return {
        currentMeetId,
        remoteUsersMap,
        isPrivateMeet,

        findMeetById,
        setCurrentMeet,
        joinMeet,
        createMeet,
        leaveMeet,

        updateMeetUser,
        removeUserFromMeet
    }

})

