import meetChatStyles from './css/meet-chat.css?inline'
import {BUS_EVENTS, DATA_CHANNELS_MESSAGE_TYPE} from "@/constants/constants.js";
import {useEventBus} from "@/features/useEventBus.js";
import {useWebRtcDataChannels} from "@/features/web-rtc/useWebRtcDataChannels.js";
import {localUserStore} from "@/store/localUserStore.js";
const MeetChatTemplate = document.getElementById('meetChatTemplate');
const {listenEvent} = useEventBus()
const {sendDataChanelMessage} = useWebRtcDataChannels()
export class MeetChat extends HTMLElement {

    constructor() {
        super();

        const shadow =   this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(meetChatStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            MeetChatTemplate.content.cloneNode(true)
        );

        this.formTag = this.shadowRoot.querySelector('form')
        this.textMessageInput = this.shadowRoot.querySelector('[data-input-type="text-message"]')

        this.messagesList = this.shadowRoot.querySelector('[data-role="messages-list"]')
    }

    printChatMessage({userName,text}) {
        const listItem = document.createElement('li')
        listItem.innerText = `[${userName}] : ${text}`
        this.messagesList.append(listItem)
    }

    onDataChanelOpen(eventData){
        const {  fromUserName } = eventData

        const text = 'joinedMeet'

        this.printChatMessage({ userName:fromUserName, text})
    }

    onDataChanelClose(eventData){
        const {  fromUserName } = eventData

        const text = 'leaveMeet'

        this.printChatMessage({ userName:fromUserName, text})
    }

    onDataChanelTextMessage (eventData){
        const { data , type , fromUserName } = eventData

        if (type !== DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE ) {
            return
        }

        const { text }= data

        this.printChatMessage({ userName:fromUserName, text})
    }


    onSubmitForm = async (e) => {
        e.preventDefault()

        const text = this.textMessageInput.value

        if (!text) {
            return
        }

        const payload = {
            type: DATA_CHANNELS_MESSAGE_TYPE.DATA_CHANEL_TEXT_MESSAGE,
            data: {
                text,
            }
        }

        sendDataChanelMessage(payload)


        this.printChatMessage({ userName :localUserStore.userName , text})

        this.textMessageInput.value = '';
    }

    async connectedCallback() {
        this.formTag.onsubmit = this.onSubmitForm
        listenEvent(BUS_EVENTS.DATA_CHANEL_TEXT_MESSAGE, this.onDataChanelTextMessage.bind(this))
        listenEvent(BUS_EVENTS.DATA_CHANEL_OPEN, this.onDataChanelOpen.bind(this))
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

