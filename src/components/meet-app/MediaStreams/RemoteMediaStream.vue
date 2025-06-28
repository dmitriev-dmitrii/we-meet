<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">
    <video style="height: 200px;width: 200px" autoplay muted ref="remoteMedaStreamElement"></video>

    <div>userName {{ userName }}</div>
    <div>
      peer status {{ peerStatus }}
    </div>
    <div>
      audio {{ isOnAudio }}
    </div>

    <div>
      video
      {{ isOnVideo }}
    </div>

  </div>

</template>

<script>
import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue'

import {BUS_EVENTS, MEDIA_TRACK_KIND, PEER_CONNECTIONS_STATE_STATUSES} from "@/constants/constants.js";
import {mediaStreams} from "@/store/webRtcStore.js";
import {useEventBus} from "@/features/useEventBus.js";

const COMPONENT_CONNECTION_STATE = {
  LOADING: "loading",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
}

const COMPONENT_CONNECTION_STATE_BY_PEER_STATUS = {
  [PEER_CONNECTIONS_STATE_STATUSES.NEW]: COMPONENT_CONNECTION_STATE.LOADING,
  [PEER_CONNECTIONS_STATE_STATUSES.CONNECTING]: COMPONENT_CONNECTION_STATE.LOADING,
  [PEER_CONNECTIONS_STATE_STATUSES.CONNECTED]: COMPONENT_CONNECTION_STATE.CONNECTED,

  [PEER_CONNECTIONS_STATE_STATUSES.FAILED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
  [PEER_CONNECTIONS_STATE_STATUSES.CLOSED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
  [PEER_CONNECTIONS_STATE_STATUSES.DISCONNECTED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
}
export default defineComponent({
  name: "RemoteMediaStream",

  props: {
    userId: {
      required: true
    },
    userAccentColor: {
      default: ''
    },
    userName: {
      default: ''
    },
    peerStatus: {
      required: true,
      default: PEER_CONNECTIONS_STATE_STATUSES.NEW
    }
  },
  setup(props) {

    const {userId} = props
    const remoteMedaStreamElement = useTemplateRef('remoteMedaStreamElement')

    const streamComponentState = ref('')

    const isOnAudio = ref(false)
    const isOnVideo = ref(false)
    const setupRemoteMediaStream = () => {

      if (!mediaStreams[userId]?.video) {
        return
      }

      const {streams} = mediaStreams[userId][MEDIA_TRACK_KIND.VIDEO]

      const [remoteVideoStream] = streams

      if (remoteVideoStream instanceof MediaStream) {
        unref(remoteMedaStreamElement).srcObject = remoteVideoStream
      }

    }

    const updateRemoteMediaTrackHandle = (eventData) => {
      const {remoteUserId} = eventData

      if (remoteUserId === userId) {
        setupRemoteMediaStream()
      }
    }

    const updateMediaTrackStateHandle = (eventData) => {

      const {from, data} = eventData

      if (from !== userId) {
        return
      }

      isOnAudio.value = data.audio
      isOnVideo.value = data.video

      if (data.video) {
        setupRemoteMediaStream()
      }

    }

    const {listenEvent} = useEventBus()

    listenEvent(BUS_EVENTS.REMOTE_USER_ON_TRACK, updateRemoteMediaTrackHandle)
    listenEvent(BUS_EVENTS.UPDATE_REMOTE_USER_MEDIA_TRACK_STATE, updateMediaTrackStateHandle)

    const setComponentStateByPeerStatus = (peerStatus) => {

      if (!Object.keys(COMPONENT_CONNECTION_STATE_BY_PEER_STATUS).includes(peerStatus)) {
        return
      }

      streamComponentState.value = COMPONENT_CONNECTION_STATE_BY_PEER_STATUS[peerStatus]
    }

    watch(() => props.peerStatus, setComponentStateByPeerStatus)

    onMounted(async () => {
      setComponentStateByPeerStatus(props.peerStatus)
      setupRemoteMediaStream()
    })

    return {
      setupRemoteMediaStream,
      isOnAudio,
      isOnVideo
    }

    // TODO  не стабильно работает видео при соединении - придумать как дожидаться что канал и все пиры готовы к трансляции
    // TODO придумать другой способ как сообщить о переключении  состояния микрофона и видео  у remoteUser
  }
})
</script>

<style scoped>

</style>