import {RemoteMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/RemoteMediaStream.js";
import meetAppStyles from './css/meet-app.css?inline'
import {LocalMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/LocalMediaStream.js";
import {meetStore} from "@/store/meetStore.js";
import {useEventBus} from "@/features/useEventBus.js";
import {BUS_EVENTS, PEER_CONNECTIONS_STATE_STATUSES} from "@/constants/constants.js";

const meetAppTemplate = document.getElementById('meetAppTemplate');

const {listenEvent} = useEventBus()

export class MeetApp extends HTMLElement {

    remoteMediaStreamsComponentsMap = new Map()

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(meetAppStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            meetAppTemplate.content.cloneNode(true)
        );

        this.mediaStreamsWrapper = this.shadowRoot.querySelector('[data-role="media-streams-wrapper"]')

    }

    updatePeerStatusHandle(eventData) {

        const {remoteUserId, status} = eventData

        if (status === PEER_CONNECTIONS_STATE_STATUSES.CHECKING) {
            this.remoteMediaStreamsComponentsMap.set(remoteUserId, new RemoteMediaStream({remoteUserId}))
            this.mediaStreamsWrapper.append(this.remoteMediaStreamsComponentsMap.get(remoteUserId))
        }

        if (this.remoteMediaStreamsComponentsMap.has(remoteUserId)) {
            this.remoteMediaStreamsComponentsMap.get(remoteUserId).peerStatusChangeHandle(status)
        }

    }

    updateMediaStreamHandle(eventData) {

        const {remoteUserId} = eventData

        if (this.remoteMediaStreamsComponentsMap.has(remoteUserId)) {
            this.remoteMediaStreamsComponentsMap.get(remoteUserId).setupRemoteMediaStream()
        }

    }

    updateMediaTrackStateHandle(eventData) {

        const {remoteUserId, audio, video} = eventData

        if (this.remoteMediaStreamsComponentsMap.has(remoteUserId)) {
            this.remoteMediaStreamsComponentsMap.get(remoteUserId).updateVideoStatus(video)
            this.remoteMediaStreamsComponentsMap.get(remoteUserId).updateAudioStatus(audio)
        }

    }


    async connectedCallback() {
        this.mediaStreamsWrapper.append(new LocalMediaStream())

        listenEvent(BUS_EVENTS.UPDATE_PEER_CONNECTION_STATUS, this.updatePeerStatusHandle.bind(this))
        listenEvent(BUS_EVENTS.UPDATE_REMOTE_USER_MEDIA_STREAM, this.updateMediaStreamHandle.bind(this))
        listenEvent(BUS_EVENTS.UPDATE_REMOTE_USER_MEDIA_TRACK_STATE, this.updateMediaTrackStateHandle.bind(this))

    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }

}

