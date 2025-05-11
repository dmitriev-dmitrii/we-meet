import {createSharedComposable} from "@/utils/sharedComposable.js";

export const APP_STEPS = Object.freeze({
    CREATE_MEET_STEP: '0',
    JOIN_MEET_STEP: '1',
    MEETING_STEP: '2',
});

const COMPONENTS_BY_STEP_MAP =  Object.freeze({
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

        for (const [key , value] of Object.entries(COMPONENTS_BY_STEP_MAP)) {
            document.querySelector( value ).hidden = key !== currentStep
        }
    };

    return {
        setStep,
    };
});