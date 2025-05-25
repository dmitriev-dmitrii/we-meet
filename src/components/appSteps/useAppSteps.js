import {createSharedComposable} from "@/utils/sharedComposable.js";

const APP_WRAPPER_ELEMENT = document.getElementById('app-steps')
export const APP_STEPS = Object.freeze({
    CREATE_MEET_STEP: '0',
    JOIN_MEET_STEP: '1',
    MEETING_STEP: '2',
});

const COMPONENTS_BY_STEP_MAP = Object.freeze({
    [APP_STEPS.CREATE_MEET_STEP]: 'create-meet-form',
    [APP_STEPS.JOIN_MEET_STEP]: 'join-meet-form',
    [APP_STEPS.MEETING_STEP]: 'meet-app',
});

let currentStep = APP_STEPS.CREATE_MEET_STEP;

export const useAppSteps = createSharedComposable(() => {
    const setStep = (step) => {

        if (!Object.values(APP_STEPS).includes(step)) {
            return;
        }

        currentStep = step;

        [...APP_WRAPPER_ELEMENT.children].forEach((item) => {
            item.remove()
        })

        APP_WRAPPER_ELEMENT.append(document.createElement(COMPONENTS_BY_STEP_MAP[step]))
    };

    return {
        setStep,
    };
});