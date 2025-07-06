import {usersApi} from "@/api/usersApi.js";
import {ref} from "vue";


export const localUserStore = {

    userId: '',

    userName: '',

    userStreams: {},



    initLocalMediaStream: async () => {
        try {
            const {active} = localUserStore.userStreams = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            //cb navigator.mediaDevices.ondevicechange TODO
            //TODO many media input device - select?

        } catch (e) {
            console.log('initLocalMediaStream err', e)
        }
        finally {

        }
    },

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

    auth: async () => {

        const {userName} = localUserStore

        const payload = {
            userName
        }

        const {data} = await usersApi.userAuth(payload)

        localUserStore.userName = data.userName
        localUserStore.userId = data.userId
        localUserId.value = data.userId
    },


}

const localUserId = ref('')

const localIsConnectedToMeet = ref(false)

const setLocalUserIsConnected = (val) =>{
    localIsConnectedToMeet.value = !!val
}

export const useLocalUserStore = ()=> {

    return {
        localIsConnectedToMeet,
        localUserId,
        setLocalUserIsConnected
    }
}
