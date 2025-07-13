
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

export const DISCONNECTED_STATE_STATUSES = [
    PEER_CONNECTIONS_STATE_STATUSES.FAILED,
    PEER_CONNECTIONS_STATE_STATUSES.CLOSED,
    PEER_CONNECTIONS_STATE_STATUSES.DISCONNECTED
]
