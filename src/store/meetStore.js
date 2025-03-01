import {meetApi} from "@/api/meetApi.js";
import {mediaStreams, peerConnections, remoteMediaStreamsDomMap} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {closeWebSocket, connectToWebSocket} from "@/features/ws.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {RemoteMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/RemoteMediaStream.js";

const webRtcMediaStreams = document.querySelector('meet-app'); //TODO перенести в meetApp
const remoteMeetUsersMap = new Map() //TODO перенести в meetApp

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

    const {data} = await meetApi.joinMeetRequest({ meetId, userId, userName })

    await connectToWebSocket()
    await sendMeOffer()

    const currentUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(currentUrl.search);

    urlParams.set('meetId',     meetId)
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

    meetStore.remoteUsers.forEach((item) => {
        removeUserFromMeet(item)
    })

    closeWebSocket()
}

const appendUserToMeet = (payload) => {

    const { remoteUserName, remoteUserId, pairName } = payload

    remoteMeetUsersMap.set(remoteUserId, payload)

    if (remoteMediaStreamsDomMap.has(remoteUserId)) {
        return
    }

    const streams = mediaStreams[remoteUserId]
    remoteMediaStreamsDomMap.set(remoteUserId, new RemoteMediaStream({remoteUserName, remoteUserId, streams, pairName}))

    webRtcMediaStreams.append(remoteMediaStreamsDomMap.get(remoteUserId))

}

const removeUserFromMeet = ({remoteUserId, pairName}) => {

    deleteMediaStream(remoteUserId)
    deleteDataChanel(pairName)
    deletePeerConnection(pairName)

    remoteMediaStreamsDomMap.get(remoteUserId).removeMediaStreamComponent()
    remoteMediaStreamsDomMap.delete(remoteUserId)
    // remoteMeetUsersMap.delete(remoteUserId)
}
export const meetStore = {
    meetId : '',
    get remoteUsers() {
        return [...remoteMeetUsersMap.values()]
    },
    set remoteUsers(value) {
        remoteMeetUsersMap.clear()
        value.forEach((item) => {
            remoteMeetUsersMap.set(item.id, item)
        })
    },
    get localUserIsOwner() {
        return meetStore.meetId && meetStore.ownerUserId === localUserStore.userId
    },
    removeUserFromMeet,
    appendUserToMeet,
    joinMeet,
    createMeet,
    leaveMeet,
}


