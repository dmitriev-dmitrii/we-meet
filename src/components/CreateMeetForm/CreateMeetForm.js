import joinMeetFormStyles from './css/create-meet-form.css?inline'
import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
import {APP_STEPS, useAppSteps} from "@/features/useAppSteps.js";

const createMeetFormTemplate = document.getElementById('createMeetFormTemplate');

const CREATE_MEET_FORM_ACTION_BAR_MAP = {
    CREATE_MEET: 'create-meet',
    COPY_MEET_LINK: 'copy-meet-link',
    GO_TO_MEET: 'go-to-meet',
}
const {setStep} = useAppSteps();
export class CreateMeetForm extends HTMLElement {
    isLoading = false

    constructor() {

        super();

        const shadow = this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(joinMeetFormStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            createMeetFormTemplate.content.cloneNode(true)
        );

        this.formTag = this.shadowRoot.querySelector('form')
        this.legendTag = this.shadowRoot.querySelector('legend')
        this.fieldsetTag = this.shadowRoot.querySelector('fieldset')


        this.userNameInput = this.shadowRoot.querySelector('[data-input-type="user-name"]')
        this.meetPaswordInput = this.shadowRoot.querySelector('[data-input-type="meet-password"]')

        this.actionsBar = this.shadowRoot.querySelector('[data-role="actions-bar"]')

        this.createMeetButton = this.actionsBar.querySelector(`[data-action-type="${CREATE_MEET_FORM_ACTION_BAR_MAP.CREATE_MEET}"]`)
        this.goToMeetButton = this.actionsBar.querySelector(`[data-action-type="${CREATE_MEET_FORM_ACTION_BAR_MAP.GO_TO_MEET}"]`)
        this.copyMeetLinkButton = this.actionsBar.querySelector(`[data-action-type="${CREATE_MEET_FORM_ACTION_BAR_MAP.COPY_MEET_LINK}"]`)
    }

    async onActionBarClick(e) {

        const eventTarget = e.target
        e.stopPropagation()
        const {actionType} = eventTarget.dataset

        if (!Object.values(CREATE_MEET_FORM_ACTION_BAR_MAP).includes(actionType)) {
            return
        }

        if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.CREATE_MEET) {
            await this.createMeet()
            return;
        }

        if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.COPY_MEET_LINK) {
            this.copyMeetHref()
        }

        if (actionType === CREATE_MEET_FORM_ACTION_BAR_MAP.GO_TO_MEET) {
            await this.joinMeet()
        }

    }

    async joinMeet() {
        try {
            if (this.isLoading) {
                return
            }

            this.isLoading = true

            this.goToMeetButton.setAttribute('data-loading', 'true')

            await meetStore.joinMeet()

            this.goToMeetButton.setAttribute('data-loading', 'false')
            this.isLoading = false

            setStep(APP_STEPS.MEETING_STEP)

        } catch (e) {
            console.error('create meet form joinMeet', e)
        }
    }

    async createMeet() {

        try {
            if (this.isLoading) {
                return
            }

            this.isLoading = true

            this.createMeetButton.setAttribute('data-loading', 'true')

            this.copyMeetLinkButton.disabled = true
            this.goToMeetButton.disabled = true

            await localUserStore.auth()
            await meetStore.createMeet({password: this.meetPaswordInput.value})

            if (meetStore.meetId) {
                this.copyMeetLinkButton.disabled = false
                this.goToMeetButton.disabled = false
            }

            this.createMeetButton.setAttribute('data-loading', 'false')
            this.createMeetButton.disabled = true

        } catch (e) {
            console.log(e)
        } finally {
            this.isLoading = false
        }
    }
    copyMeetHref() {
        console.log('copyMeetHref', window.location.href)
    }

    onSubmitForm = async (e) => {
        e.preventDefault()
        localUserStore.userName =  this.userNameInput.value
        await this.createMeet()
    }

    async connectedCallback() {

        this.actionsBar.addEventListener('click', this.onActionBarClick.bind(this))
        this.formTag.onsubmit = this.onSubmitForm

        this.copyMeetLinkButton.disabled = true
        this.goToMeetButton.disabled = true

        this.userNameInput.value = localUserStore.userName

        setTimeout(()=>{
            this.legendTag.classList.add('mounted')
            this.fieldsetTag.classList.add('mounted')
            this.formTag.classList.add('mounted')

        },100)
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

