<template>

  <div style="display: flex; flex-direction: column; border: 1px solid">
    <video style="height: 200px;width: 200px" autoplay muted ref="remoteMedaStreamElement"></video>

    <div> {{ userName }}</div>
    <div>
      peer status :{{ peerStatus }}
    </div>
    <div>
      audio {{ audio }}
    </div>

    <div>
      video
      {{ video }}
    </div>

  </div>

</template>

<script>
import {defineComponent, onMounted, ref, unref, useTemplateRef, watch} from 'vue'

import { MEDIA_TRACK_KIND, PEER_CONNECTIONS_STATE_STATUSES} from "@/constants/web-rtc.js";
import {useWebRtcStore} from "@/store/webRtcStore.js";


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
    },
    audio: {
      type: Boolean,
      default: false
    },
    video: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {

    const {
      mediaStreams
    } = useWebRtcStore()

    const remoteMedaStreamElement = useTemplateRef('remoteMedaStreamElement')

    const streamComponentState = ref(COMPONENT_CONNECTION_STATE.LOADING)

    const setupRemoteMediaStream = () => {

      // TODO -  if only audio stream ?

      if (mediaStreams[props.userId]?.video) {

        const {streams} = mediaStreams[props.userId][MEDIA_TRACK_KIND.VIDEO]

        const [remoteVideoStream] = streams

        if (remoteVideoStream instanceof MediaStream) {
          unref(remoteMedaStreamElement).srcObject = remoteVideoStream
        }

      }

    }



    const setComponentStateByPeerStatus = (peerStatus) => {

      if (!Object.keys(COMPONENT_CONNECTION_STATE_BY_PEER_STATUS).includes(peerStatus)) {
        return
      }

      streamComponentState.value = COMPONENT_CONNECTION_STATE_BY_PEER_STATUS[peerStatus]

      if (streamComponentState.value === COMPONENT_CONNECTION_STATE.CONNECTED) {
        setupRemoteMediaStream()
      }
    }

    watch(() => props.peerStatus, setComponentStateByPeerStatus)

    onMounted(async () => {
      setComponentStateByPeerStatus(props.peerStatus)
      setupRemoteMediaStream()
    })

    return {

    }

    // TODO  не стабильно работает видео при соединении - придумать как дожидаться что канал и все пиры готовы к трансляции
    // TODO придумать другой способ как сообщить о переключении  состояния микрофона и видео  у remoteUser
  }
})
</script>

<style scoped>

</style>