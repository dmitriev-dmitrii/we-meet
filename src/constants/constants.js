export const WEB_SOCKET_EVENTS = {
    'WS_CONNECTION': '1', //user joined meet
    'WS_CLOSE': '2', //user  leave meet

    'RTC_SEND_ME_OFFER': '3',
    'RTC_OFFER': '4',
    'RTC_ANSWER': '5',
    'RTC_ICE_CANDIDATE': '6',
}
export const DATA_CHANNELS_MESSAGE_TYPE = {
    DATA_CHANEL_TEXT_MESSAGE: '1',
    DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE: '2',
}

export const PEER_CONNECTIONS_STATE_STATUSES = {
    NEW: 'new',
    CONNECTING: 'connecting',
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    FAILED: "failed",
    CLOSED: "closed",
}

export const MEDIA_TRACK_KIND = {
    'AUDIO': 'audio',
    'VIDEO': 'video'
}

export const BUS_EVENTS = {

    UPDATE_PEER_CONNECTION_STATUS: '0',

    REMOTE_USER_ON_TRACK: '1',

    UPDATE_REMOTE_USER_MEDIA_TRACK_STATE: '2',

    DATA_CHANEL_OPEN: '3',
    DATA_CHANEL_CLOSE: '4',
    DATA_CHANEL_TEXT_MESSAGE: '5',

};

export const DISCONNECTED_STATE_STATUSES = [
    PEER_CONNECTIONS_STATE_STATUSES.FAILED,
    PEER_CONNECTIONS_STATE_STATUSES.CLOSED,
    PEER_CONNECTIONS_STATE_STATUSES.DISCONNECTED
]
