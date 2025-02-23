import {meetApi} from "@/api/meetApi.js";
import {DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {mediaStreams, remoteMediaStreamsDomMap} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {closeWebSocket} from "@/features/ws/ws.js";
import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";
import {RemoteMediaStream} from "@/components/mediaStreams/RemoteMediaStream.js";

const webRtcMediaStreams = document.getElementById('webRtcMediaStreams');//TODO перенести куда то

const {
    sendDataChanelMessage,
    deleteDataChanel
} = useWebRtcDataChannels()

const {
    deleteMediaStream,
} = useWebRtcMediaStreams()

const {
    deletePeerConnection
} = useWebRtcConnections()

const remoteMeetUsersMap = new Map()


const createMeet = async () => {

    const payload = {
        userName: localUserStore.userName,
        userId: localUserStore.userId
    }
    const {data} = await meetApi.createMeet(payload)
    meetStore.meetId = data.meetId

}

const sendJoinMeetRequest = async () => {
    const {meetId} = meetStore
    const {userId, userName} = localUserStore

    const {data} = await meetApi.joinMeetRequest({meetId, userId, userName})

    // TODO  feature check   password
}
const leaveMeet = () => {

    const payload = {
        type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_CLOSE,
        data: {
            //TODO reason
        }
    }

    sendDataChanelMessage(payload)

    remoteMediaStreamsDomMap.forEach((item) => {
        item.removeMediaStreamComponent()
    })

    remoteMediaStreamsDomMap.clear()
    remoteMeetUsersMap.clear()

    meetStore.meetId = ''

    closeWebSocket()
}

const appendUserToMeet = (payload) => {

    const { remoteUserName, remoteUserId, pairName } = payload

    remoteMeetUsersMap.set(remoteUserId, payload)



    if (remoteMediaStreamsDomMap.has(remoteUserId)) {
        return
    }
    const streams = mediaStreams[remoteUserId]
    remoteMediaStreamsDomMap.set(remoteUserId, new RemoteMediaStream({ remoteUserName, remoteUserId, streams , pairName }))
    webRtcMediaStreams.append(remoteMediaStreamsDomMap.get(remoteUserId))

}

const removeUserFromMeet = ({remoteUserId , pairName }) => {
    remoteMeetUsersMap.delete(remoteUserId)

    deleteMediaStream(remoteUserId)
    deleteDataChanel(pairName)
    deletePeerConnection(pairName)

    remoteMediaStreamsDomMap.get(remoteUserId).removeMediaStreamComponent()
    remoteMediaStreamsDomMap.delete(remoteUserId)
}


export const meetStore = {
    get meetId() {
        return new URLSearchParams(window.location.search).get('meetId')
    },
    set meetId(value) {
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);

        value ? urlParams.set('meetId', value) : urlParams.delete('meetId');

        currentUrl.search = urlParams.toString();
        window.history.pushState(null, '', currentUrl)
    },
    get remoteUsers() {
        return [...remoteMeetUsersMap.values()]
    },
    set remoteUsers(value) {
        remoteMeetUsersMap.clear()
        value.forEach((item) => {
            remoteMeetUsersMap.set(item.id, item)
        })
    },
    removeUserFromMeet,
    appendUserToMeet,
    sendJoinMeetRequest,
    createMeet,
    leaveMeet,
}


