import {RemoteMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/RemoteMediaStream.js";

const meetAppTemplate = document.getElementById('meetAppTemplate');
import meetAppStyles from './css/meet-app.css?inline'
import {LocalMediaStream} from "@/components/AppSteps/MeetApp/MediaStreams/LocalMediaStream.js";

import {meetStore} from "@/store/meetStore.js";

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


    remoteMeetUsersMapChangeCallback = (mapValue, eventName) => {

        mapValue.entries().forEach(([remoteUserId, user]) => {

            if (this.remoteMediaStreamsComponentsMap.has(remoteUserId)) {

                const component = this.remoteMediaStreamsComponentsMap.get(remoteUserId)

                const {video, audio} = user

                component.updateAudioStatus(audio)
                component.updateVideoStatus(video)

                return
            }

            this.remoteMediaStreamsComponentsMap.set(remoteUserId, new RemoteMediaStream({remoteUserId}))
            this.mediaStreamsWrapper.append(this.remoteMediaStreamsComponentsMap.get(remoteUserId))

        })

    }

    async connectedCallback() {
        this.mediaStreamsWrapper.append(new LocalMediaStream())

        meetStore.remoteMeetUsersMap.subscribe(this.remoteMeetUsersMapChangeCallback)
        console.log('meetApp mounted ', meetStore.remoteMeetUsersMap.values())
    }

    disconnectedCallback() {
        meetStore.remoteMeetUsersMap.unSubscribe(this.remoteMeetUsersMapChangeCallback)
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }

}

