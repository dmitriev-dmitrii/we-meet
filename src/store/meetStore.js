import {meetApi} from "@/api/meetApi.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {closeWebSocket, connectToWebSocket} from "@/features/ws.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";

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

    closeWebSocket()
}

const removeUserFromMeet = ({remoteUserId}) => {

    deleteMediaStream(remoteUserId)
    deleteDataChanel(remoteUserId)
    deletePeerConnection(remoteUserId)
}
export const meetStore = {
    meetId: '',
    get localUserIsOwner() {
        return meetStore.meetId && meetStore.ownerUserId === localUserStore.userId
    },
    removeUserFromMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}


