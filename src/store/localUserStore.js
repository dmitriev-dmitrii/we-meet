import {usersApi} from "@/api/usersApi.js";
import {computed, ref, shallowRef, unref, watch} from "vue";
import {useDevicesList} from "@vueuse/core";

const constraints = {audio: true, video: true};
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

const localUserMediaStreams = shallowRef()

const localAudioState = computed({
    get() {
        try {

            const audioTracks = unref(localUserMediaStreams).getAudioTracks()

            return audioTracks.some((item) => item.enabled)
        } catch (e) {
            return false
        }
    },
    set(value) {
        try {
            const audioTracks = unref(localUserMediaStreams).getAudioTracks()

            return  audioTracks.find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value

        } catch (e) {
            return false
        }
    }
})

const localVideoState = computed({
    get() {
        try {
            const videoTracks = unref(localUserMediaStreams).getVideoTracks()

            return videoTracks.some((item) => item.enabled)
        } catch (e) {

            return false
        }
    },

    set(value) {
        try {
            const videoTracks = unref(localUserMediaStreams).getVideoTracks()

            return videoTracks.find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value


        } catch (e) {

            return false
        }
    },
})

const currentVideoInputId = ref('')
const currentAudioInputId = ref('')
const currentAudioOutputId = ref('')

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

            localUserMediaStreams.value = await navigator.mediaDevices.getUserMedia(constraints);

        } catch (e) {
            console.log('initLocalMediaStream err', e)
        } finally {

        }
    }


    watch([currentAudioInputId, currentVideoInputId], () => {
        // TODO смена медиа инпутов
    })

    return {
        localUserMediaStreams,
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
    }
}
