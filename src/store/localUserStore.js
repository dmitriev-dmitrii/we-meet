import {usersApi} from "@/api/usersApi.js";
import {reactive, ref, shallowRef} from "vue";
import {useDevicesList} from "@vueuse/core";

export const localUserStore = {

    userStreams: {},

    get audio() {
        try {
            return this.userStreams.getAudioTracks().some((item) => item.enabled)
        } catch (e) {
            return false
        }
    },

    set audio(value) {
        try {
            this.userStreams.getAudioTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value
            return value
        } catch (e) {
            return false
        }
    },

    get video() {
        try {
            return this.userStreams.getVideoTracks().some((item) => item.enabled)
        } catch (e) {

            return false
        }
    },

    set video(value) {
        try {
            this.userStreams.getVideoTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = value
            return value
        } catch (e) {

            return false
        }
    },

}

const constraints = {audio: true, video: true}


const localUserId = ref('')
const localUserName = ref('')

const localUserIsConnectedToMeet = ref(false)

export const useLocalUserStore = () => {

    const {
        videoInputs,
        audioInputs
    } = useDevicesList({
        constraints
    })

    const setLocalUserIsConnected = (val) => {
        //ws is connected

        localUserIsConnectedToMeet.value = !!val
    }

    const auth = async ({userName = ''} = {}) => {

        const {data} = await usersApi.userAuth({userName})

        localUserId.value = data.userId
        localUserName.value = data.userName

        return data
    }

    const initLocalMediaStream = async () => {

        try {


            const {active} = localUserStore.userStreams = await navigator.mediaDevices.getUserMedia(constraints);

            //cb navigator.mediaDevices.ondevicechange TODO
            //TODO many media input device - select?

        } catch (e) {
            console.log('initLocalMediaStream err', e)
        } finally {

        }
    }

    return {
        videoInputs,
        audioInputs,
        localUserIsConnectedToMeet,
        localUserId,
        localUserName,
        setLocalUserIsConnected,
        initLocalMediaStream,
        auth,
    }
}
