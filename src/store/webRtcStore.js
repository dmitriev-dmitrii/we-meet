import {usersApi} from "@/api/usersApi.js";


export const peerConnections = {};
export const dataChannels = {};
export const mediaStreams = {};

const fetchIceServers = async () => {
    try {
        webRtcStore.iceServers = await usersApi.getIceServers()
    } catch (err) {
        alert('fetchIceServers err ' + err.message)
        throw err
    }
}

export const webRtcStore = {
    peerConnections,
    dataChannels,
    mediaStreams,
    iceServers: [],
    fetchIceServers,
}
window.webRtcStore = webRtcStore
console.log(webRtcStore)