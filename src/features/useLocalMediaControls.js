import {computed, ref, shallowRef, unref, watch} from "vue";
import {useDevicesList, createSharedComposable} from "@vueuse/core";

const constraints = {audio: true, video: true};
export const useLocalMediaControls = createSharedComposable(() => {

    const localUserMediaStreams = shallowRef()

    const isAllowLocalMediaPermissions = ref(false)
    const isLoadingLocalMedia = ref(false)

    const videoInputs = ref([])
    const audioInputs = ref([])
    const audioOutputs = ref([])

    const currentVideoInputId = ref('')
    const currentAudioInputId = ref('')
    const currentAudioOutputId = ref('')

    const {
        devices,
        isSupported,
        ensurePermissions
    } = useDevicesList({
        constraints,
        onUpdated: (e) => {
            updateDevicesList(e)
        }
    })

    const updateDevicesList = () => {
        const parsedDevices = unref(devices).reduce((acc, item) => {

            if (item.deviceId === "default") {
                return acc
            }

            if (!acc[item.kind]) {
                acc[item.kind] = []
            }

            acc[item.kind].push(item)

            return acc

        }, {})

        audioInputs.value = parsedDevices['audioinput'] ?? []
        videoInputs.value = parsedDevices['videoinput'] ?? []
        audioOutputs.value = parsedDevices['audiooutput'] ?? []

        if (!unref(isAllowLocalMediaPermissions)) {
            return
        }

        // находим дефолтно выбранные устройства
        const [audioTrack] = localUserMediaStreams.value.getAudioTracks();
        const audioSettings = audioTrack.getSettings();
        currentAudioInputId.value = audioSettings.deviceId


        const [videoTrack] = localUserMediaStreams.value.getAudioTracks();
        const videoSettings = videoTrack.getSettings();
        currentVideoInputId.value = videoSettings.deviceId

    }


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

                return audioTracks.find(({readyState}) => {
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


    const initLocalMediaStream = async () => {

        try {
            isLoadingLocalMedia.value = true

            await ensurePermissions()
            updateDevicesList()

            if (!unref(isSupported)) {
                localAudioState.value = false
                localVideoState.value = false
                return
            }

            localUserMediaStreams.value = await navigator.mediaDevices.getUserMedia(constraints);


            // const [audioTrack] = localUserMediaStreams.value.getAudioTracks();
            // const audioSettings = audioTrack.getSettings();
            // currentAudioInputId.value = audioSettings.deviceId
            // const settings = audioTrack.getSettings();

            isAllowLocalMediaPermissions.value = true

        } catch (e) {
            console.log('initLocalMediaStream err', e)
            isAllowLocalMediaPermissions.value = false
        } finally {
            isLoadingLocalMedia.value = false
        }
    }


    watch([currentAudioInputId, currentVideoInputId, currentAudioOutputId], () => {
        console.log('hui')
        // TODO смена медиа инпутов
    })

    return {
        localUserMediaStreams,
        localVideoState,
        localAudioState,
        isAllowLocalMediaPermissions,
        videoInputs,
        audioInputs,
        audioOutputs,
        isLoadingLocalMedia,
        initLocalMediaStream,
    }
});
