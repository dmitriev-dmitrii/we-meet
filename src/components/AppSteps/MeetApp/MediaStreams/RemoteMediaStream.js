import mediaStreamStyles from './css/media-stream.css?inline'
import remoteMediaStreamStyles from './css/remote-media-stream.css?inline'
import {mediaStreams} from "@/store/webRtcStore.js";
import {MEDIA_TRACK_KIND} from "@/constants/constants.js";
import {meetStore} from "@/store/meetStore.js";

const remoteMediaStreamTemplate = document.getElementById('remote-media-stream-template');

export class RemoteMediaStream extends HTMLElement {

    remoteUserName = '';

    streams = []

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

    async setupVideoStream() {

        console.log(mediaStreams.values())

        const userStreams = mediaStreams.get(this.remoteUserId)

        const [videoStream] = userStreams[MEDIA_TRACK_KIND.VIDEO]?.streams

        if (videoStream) {
            this.videoTagElement.srcObject = videoStream
            await this.videoTagElement.play()
        }

    }

    async usersMapChangeHandle() {
        await this.setupVideoStream()

        const {audio, video} = meetStore.remoteMeetUsersMap.get(this.remoteUserId)

        this.updateVideoStatus(video)
        this.updateAudioStatus(audio)
    }

    async connectedCallback() {
        this.remoteUserName = this.remoteUserId
        this.userLabelElement.innerText = this.remoteUserName
    }

    disconnectedCallback() {
        console.log(this.remoteUserName, "RemoteMediaStream removed from dom");
    }

    adoptedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);

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

    removeMediaStreamComponent() {
        this.classList.add('remove');
        this.videoTagElement.muted = true
        this.videoTagElement.pause()

        setTimeout(() => {
            this.remove();
        }, 300);
    }
}