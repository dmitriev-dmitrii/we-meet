export const peerConnections = {};
export const dataChannels = {};
export const mediaStreams = {};
const getRtcUserDataById = (remoteUserId) => {
    return {
        peerConnections: peerConnections[remoteUserId],
        dataChannels: dataChannels[remoteUserId],
        mediaStreams: mediaStreams[remoteUserId],
        status: peerConnections[remoteUserId],
        remoteUserId,
    }
}
export const webRtcStore = {
    peerConnections,
    dataChannels,
    mediaStreams,
}