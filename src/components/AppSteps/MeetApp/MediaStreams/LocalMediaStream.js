import {localUserStore} from "@/store/localUserStore.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {meetStore} from "@/store/meetStore.js";

import mediaStreamStyles from './css/media-stream.css?inline'
import localMediaStreamStyles from './css/local-media-stream.css?inline'
import {APP_STEPS, useAppSteps} from "@/features/useAppSteps.js";

const localMediaStreamTemplate = document.getElementById('local-media-stream-template');

const LOCAL_STREAM_ACTION_BAR_MAP = {
    LEAVE_MEET: 'leave-meet',
    VIDEO: 'video',
    AUDIO: 'audio',
}

const {setStep} = useAppSteps();

const {sendDataChanelMessage} = useWebRtcDataChannels()

export class LocalMediaStream extends HTMLElement {

    constructor() {
        super();
        this.userName = 'me'

        const shadow =   this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(mediaStreamStyles + localMediaStreamStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]


        shadow.appendChild(
            localMediaStreamTemplate.content.cloneNode(true)
        );

        this.videoTag = this.shadowRoot.querySelector('video')
        this.videoTag.muted = true

        this.actionsBar = this.shadowRoot.querySelector('[data-role="actions-bar"]')

        this.audioToggleButton = this.actionsBar.querySelector(`[data-action-type="${LOCAL_STREAM_ACTION_BAR_MAP.AUDIO}"]`)
        this.videoToggleButton = this.actionsBar.querySelector(`[data-action-type="${LOCAL_STREAM_ACTION_BAR_MAP.VIDEO}"]`)
        this.leaveMeetButton = this.actionsBar.querySelector(`[data-action-type="${LOCAL_STREAM_ACTION_BAR_MAP.LEAVE_MEET}"]`)

        this.userLabel = this.shadowRoot.querySelector('[data-role="user-label"]')

    }


    onActionBarClick(e) {
        const eventTarget = e.target
        const {actionType} = eventTarget.dataset

        if (!Object.values(LOCAL_STREAM_ACTION_BAR_MAP).includes(actionType)) {
            return
        }

        if (actionType === LOCAL_STREAM_ACTION_BAR_MAP.LEAVE_MEET) {

            meetStore.leaveMeet()

            setStep(APP_STEPS.CREATE_MEET_STEP)
            return;
        }

        if (actionType === LOCAL_STREAM_ACTION_BAR_MAP.AUDIO) {
            localUserStore.audio = !localUserStore.audio
            this.updateAudioStatus()
        }

        if (actionType === LOCAL_STREAM_ACTION_BAR_MAP.VIDEO) {
            localUserStore.video = !localUserStore.video
            this.updateVideoStatus()
        }


        const payload = {
            type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE,
            data: {
                video: localUserStore.video,
                audio: localUserStore.audio
            }
        }

        sendDataChanelMessage(payload)

    }

    updateAudioStatus() {
        localUserStore.audio ? this.audioToggleButton.classList.add('active') : this.audioToggleButton.classList.remove('active')
    }

    updateVideoStatus() {
        if (localUserStore.video) {
            this.videoToggleButton.classList.add('active')
            this.videoTag.classList.add('active')
            this.userLabel.classList.remove('active')
            return
        }

        this.videoToggleButton.classList.remove('active')
        this.videoTag.classList.remove('active')
        this.userLabel.classList.add('active')

    }

    async connectedCallback() {

        if (!meetStore.meetId) {
            this.leaveMeetButton.hidden = true
        }

        this.actionsBar.addEventListener('click', this.onActionBarClick.bind(this))

        this.userLabel.innerText = this.userName

        if (!localUserStore.userStreams?.active) {
            await localUserStore.initLocalMediaStream()
        }

        this.videoTag.srcObject = localUserStore.userStreams

        await this.videoTag.play()

        localUserStore.audio = false
        this.updateVideoStatus()
        this.updateAudioStatus()

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

