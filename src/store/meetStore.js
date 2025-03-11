import {meetApi} from "@/api/meetApi.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {closeWebSocket, connectToWebSocket} from "@/features/ws.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";

const remoteMeetUsersMap = new Map()
// remoteMeetUsersMap TODO выпилить

const {sendMeOffer} = useWebRtcConnections()

const {
    deleteDataChanel
} = useWebRtcDataChannels()

const {
    deleteMediaStream,
} = useWebRtcMediaStreams()

const {
    deletePeerConnection
} = useWebRtcConnections()


const createMeet = async ({password}) => {

    const payload = {
        userName: localUserStore.userName,
        userId: localUserStore.userId,
        password
    }
    const {data} = await meetApi.createMeet(payload)
    meetStore.meetId = data.meetId
    meetStore.ownerUserId = data.ownerUserId
}

const joinMeet = async () => {
    await localUserStore.auth()
    const {meetId} = meetStore
    const {userId, userName} = localUserStore

    const {data} = await meetApi.joinMeetRequest({meetId, userId, userName})

    await connectToWebSocket()
    await sendMeOffer()

    const currentUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(currentUrl.search);

    urlParams.set('meetId', meetId)
    currentUrl.search = urlParams.toString();
    window.history.pushState(null, '', currentUrl)
}
const leaveMeet = () => {

    const currentUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(currentUrl.search);
    urlParams.delete('meetId');
    currentUrl.search = urlParams.toString();
    window.history.pushState(null, '', currentUrl)

    meetStore.meetId = ''

    // meetStore.remoteMeetUsersMap.forEach((item) => {
    //     removeUserFromMeet(item)
    // })

    closeWebSocket()
}
const updateRemoteUserMediaTrackState = ({remoteUserId, video, audio}) => {
    if (!remoteMeetUsersMap.has(remoteUserId)) {
        return
    }

    remoteMeetUsersMap.set(remoteUserId, {
        ...remoteMeetUsersMap.get(remoteUserId),
        ...{audio, video}
    })
}
const appendUserToMeet = (payload) => {

    const {remoteUserId , pairName , } = payload


    remoteMeetUsersMap.set(remoteUserId, { ...payload })
}

const removeUserFromMeet = ({remoteUserId, pairName}) => {

    deleteMediaStream(remoteUserId)
    deleteDataChanel(pairName)
    deletePeerConnection(pairName)
}
export const meetStore = {
    meetId: '',
    get localUserIsOwner() {
        return meetStore.meetId && meetStore.ownerUserId === localUserStore.userId
    },
    updateRemoteUserMediaTrackState,
    removeUserFromMeet,
    appendUserToMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}


