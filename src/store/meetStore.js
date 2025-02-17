import {meetApi} from "@/api/meetApi.js";
import {DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {remoteMediaStreamsDomMap} from "@/store/webRtcStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
import {closeWebSocket} from "@/features/ws/ws.js";

const {sendDataChanelMessage} = useWebRtcDataChannels()

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

    meetStore.meetId = ''

    closeWebSocket()
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
    users: [],
    sendJoinMeetRequest,
    createMeet,
    leaveMeet,
}


