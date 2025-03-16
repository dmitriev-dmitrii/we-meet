
import joinMeetFormStyles from './css/join-meet-form.css?inline'
import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";
import {APP_STEPS, useAppSteps} from "@/features/useAppSteps.js";

const joinMeetFormTemplate = document.getElementById('joinMeetFormTemplate');

const {setStep} = useAppSteps();
export class JoinMeetForm extends HTMLElement {

    constructor() {
        super();

        const shadow =   this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(joinMeetFormStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            joinMeetFormTemplate.content.cloneNode(true)
        );

        this.formTag = this.shadowRoot.querySelector('form')

        this.userNameInput = this.shadowRoot.querySelector('[data-input-type="user-name"]')
        this.meetPaswordInput = this.shadowRoot.querySelector('[data-input-type="meet-password"]')
    }

    onSubmitForm = async (e) => {
        e.preventDefault()

        try {
            localUserStore.userName =  this.userNameInput.value
            await  meetStore.joinMeet()
            setStep(APP_STEPS.MEETING_STEP)
        }
        catch(e) {
            console.log(e)
            alert( e.status +' '+ e.message )
        }
    }

    async connectedCallback() {
        this.meetPaswordInput.hidden = true

        this.formTag.onsubmit = this.onSubmitForm
        this.userNameInput.value = localUserStore.userName
    }


    async removeJoinMeetForm() {
        this.remove()
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

