import {useWebRtcMediaStreams} from "@/features/web-rtc/useWebRtcMediaStreams.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {useWebRtcConnections} from "@/features/web-rtc/useWebRtcConnections.js";

import mediaStreamStyles from './css/media-stream.css?inline'
import remoteMediaStreamStyles from './css/remote-media-stream.css?inline'
import {meetStore} from "@/store/meetStore.js";

const remoteMediaStreamTemplate = document.getElementById('remote-media-stream-template');




export class RemoteMediaStream extends HTMLElement {

    remoteUserName = '';
    pairName = ''

    streams = []

    constructor({remoteUserName = '', remoteUserId = '', streams = [], pairName} = {}) {
        super();

        this.remoteUserId = remoteUserId
        this.remoteUserName = remoteUserName || remoteUserId
        this.pairName = pairName

        this.streams = streams

        const shadow = this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(mediaStreamStyles + remoteMediaStreamStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            remoteMediaStreamTemplate.content.cloneNode(true)
        );

        this.videoTag = this.shadowRoot.querySelector('video')
        this.audioStatus = this.shadowRoot.querySelector('[data-status-type="audio"]')
        this.videoStatus = this.shadowRoot.querySelector('[data-status-type="video"]')
        this.userLabel = this.shadowRoot.querySelector('[data-role="user-label"]')

        this.userLabel.innerText = this.remoteUserName || this.remoteUserId

    }

    async connectedCallback() {
        this.videoTag.srcObject = this.streams[0]
        await this.videoTag.play()

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
        val ? this.audioStatus.classList.add('active') : this.audioStatus.classList.remove('active')

    }

    updateVideoStatus(val = false) {

        if (val) {

            this.videoStatus.classList.add('active')
            this.videoTag.classList.add('active')

            this.userLabel.classList.remove('active')
            return
        }

        this.videoStatus.classList.remove('active')
        this.videoTag.classList.remove('active')
        this.userLabel.classList.add('active')
    }

    removeMediaStreamComponent() {
        this.classList.add('remove');
        this.videoTag.muted = true
        this.videoTag.pause()

        const {remoteUserId , pairName } = this

        meetStore.removeUserFromMeet({remoteUserId , pairName })

        setTimeout(() => {
            this.remove();
        }, 300);
    }
}