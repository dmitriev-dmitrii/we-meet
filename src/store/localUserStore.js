import {usersApi} from "@/api/usersApi.js";
import {reactive, ref, shallowRef, unref, watch} from "vue";
import {useDevicesList, usePermission, useUserMedia} from "@vueuse/core";



const constraints = {audio: true, video: true};

const {stream: localUserStreams, start, enabled} = useUserMedia({constraints, autoSwitch: true});

const onUserDeviceUpdated = (e) => {
    console.log('useDevicesList updated', e)
}

const {
    videoInputs,
    audioInputs,
    audioOutputs,
    permissionGranted: isAllowLocalMediaPermissions,
    isSupported: isSupportedLocalUserMedia,
} = useDevicesList({
    constraints,
    onUpdated: onUserDeviceUpdated
})

const localUserId = ref('')
const localUserName = ref('')
const localUserIsConnectedToMeet = ref(false)

const localVideoState = ref(true)
const localAudioState = ref(true)

const currentVideoInputId = ref('')
const currentAudioInputId = ref('')
const currentAudioOutputId = ref('')



export const localUserStore = {

    get audio() {
        try {
            return unref(localUserStreams).getAudioTracks().some((item) => item.enabled)
        } catch (e) {
            return false
        }
    },

    set audio(value) {
        try {
            unref(localUserStreams).getAudioTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value
            return value
        } catch (e) {
            return false
        }
    },

    get video() {
        try {
            return unref(localUserStreams).getVideoTracks().some((item) => item.enabled)
        } catch (e) {

            return false
        }
    },

    set video(value) {
        try {
            unref(localUserStreams).getVideoTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = value
            return value
        } catch (e) {

            return false
        }
    },

}




export const useLocalUserStore = () => {
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

            if (!unref(isSupportedLocalUserMedia)) {
                localAudioState.value = false
                localVideoState.value = false
                return
            }

            await navigator.mediaDevices.getUserMedia(constraints);

            await start()


        } catch (e) {
            console.log('initLocalMediaStream err', e)
        } finally {

        }
    }


    watch([currentAudioInputId, currentVideoInputId], () => {
        // TODO смена медиа инпутов
    })

    return {
        localUserStreams,
        localVideoState,
        localAudioState,
        isAllowLocalMediaPermissions,
        isSupportedLocalUserMedia,
        videoInputs,
        audioInputs,
        audioOutputs,
        localUserIsConnectedToMeet,
        localUserId,
        localUserName,
        setLocalUserIsConnected,
        initLocalMediaStream,
        auth,
        enabled,
    }
}
