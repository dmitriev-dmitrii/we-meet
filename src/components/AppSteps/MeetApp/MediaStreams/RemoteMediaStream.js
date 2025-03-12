import mediaStreamStyles from './css/media-stream.css?inline'
import remoteMediaStreamStyles from './css/remote-media-stream.css?inline'
import {mediaStreams} from "@/store/webRtcStore.js";
import {MEDIA_TRACK_KIND, PEER_CONNECTIONS_STATE_STATUSES} from "@/constants/constants.js";

const remoteMediaStreamTemplate = document.getElementById('remote-media-stream-template');

const COMPONENT_CONNECTION_STATE = {
    LOADING: "loading",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
}


const COMPONENT_CONNECTION_STATE_BY_PEER_STATUS = {
    [PEER_CONNECTIONS_STATE_STATUSES.CONNECTING]: COMPONENT_CONNECTION_STATE.LOADING,
    [PEER_CONNECTIONS_STATE_STATUSES.CONNECTED]:COMPONENT_CONNECTION_STATE.LOADING,

    [PEER_CONNECTIONS_STATE_STATUSES.FAILED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
    [PEER_CONNECTIONS_STATE_STATUSES.CLOSED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
    [PEER_CONNECTIONS_STATE_STATUSES.DISCONNECTED]: COMPONENT_CONNECTION_STATE.DISCONNECTED,
}


export class RemoteMediaStream extends HTMLElement {

    remoteUserName = '';
    connectionState = COMPONENT_CONNECTION_STATE.LOADING

    constructor({remoteUserId = ''}) {
        super();

        this.remoteUserId = remoteUserId
        this.remoteUserName = ''

        const shadow = this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(mediaStreamStyles + remoteMediaStreamStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            remoteMediaStreamTemplate.content.cloneNode(true)
        );

        this.videoTagElement = this.shadowRoot.querySelector('video')
        this.audioStatusButton = this.shadowRoot.querySelector('[data-status-type="audio"]')
        this.videoStatusButton = this.shadowRoot.querySelector('[data-status-type="video"]')
        this.userLabelElement = this.shadowRoot.querySelector('[data-role="user-label"]')
    }

    setupRemoteMediaStream() {

        if (!mediaStreams[this.remoteUserId]?.video) {
            return
        }

        const { streams  : [remoteVideoStream] } = mediaStreams[this.remoteUserId][MEDIA_TRACK_KIND.VIDEO]

        this.videoTagElement.srcObject = remoteVideoStream
        this.videoTagElement.play()

        this.updateConnectionState(COMPONENT_CONNECTION_STATE.CONNECTED)
    }

    peerStatusChangeHandle(status) {

        const connectionState = COMPONENT_CONNECTION_STATE_BY_PEER_STATUS[status]

        this.updateConnectionState(connectionState)
    }

    updateConnectionState(state) {

        if (!Object.values(COMPONENT_CONNECTION_STATE).includes(state)) {
            return
        }

        this.connectionState = state
        this.classList.remove(...Object.values(COMPONENT_CONNECTION_STATE))
        this.classList.add(state)
    }


    updateAudioStatus(val = false) {
        val ? this.audioStatusButton.classList.add('active') : this.audioStatusButton.classList.remove('active')
    }

    updateVideoStatus(val = false) {
        if (val) {

            this.videoStatusButton.classList.add('active')
            this.videoTagElement.classList.add('active')

            this.userLabelElement.classList.remove('active')
            return
        }

        this.videoStatusButton.classList.remove('active')
        this.videoTagElement.classList.remove('active')

        this.userLabelElement.classList.add('active')
    }


    async connectedCallback() {
        this.remoteUserName = this.remoteUserId
        this.userLabelElement.innerText = this.remoteUserName
        this.setupRemoteMediaStream()
    }

    disconnectedCallback() {
        console.log(this.remoteUserName, "RemoteMediaStream removed from dom");
    }

    adoptedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);

    }


    removeMediaStreamComponent() {
        this.classList.add('remove');
        this.videoTagElement.muted = true
        this.videoTagElement.pause()

        setTimeout(() => {
            this.remove();
        }, 300);
    }
}