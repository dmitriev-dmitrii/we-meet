import {localUserStore} from "@/store/localUserStore.js";
import {meetStore} from "@/store/meetStore.js";

const meetAppTemplate = document.getElementById('meetAppTemplate');
import meetAppStyles from './css/meet-app.css?inline'
export class MeetApp extends HTMLElement {
    constructor() {
        super();

        const shadow =   this.attachShadow({mode: 'open'})

        const extraSheet = new CSSStyleSheet();
        extraSheet.replaceSync(meetAppStyles);

        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, extraSheet]

        shadow.appendChild(
            meetAppTemplate.content.cloneNode(true)
        );

    }
    async connectedCallback() {

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

