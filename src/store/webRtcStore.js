import {createGlobalState} from "@vueuse/core";
import {shallowRef, unref} from "vue";
import {usersApi} from "@/api/usersApi.js";

export const useWebRtcStore = createGlobalState(() => {


     const peerConnections = shallowRef({});
     const dataChannels = shallowRef({});
     const mediaStreams = shallowRef({});

    const iceServers = shallowRef([])

    const fetchIceServers = async () => {
        try {

            if (unref(iceServers).length) {
                return
            }

            const {data} = await usersApi.getIceServers()

            iceServers.value = data

        } catch (err) {
            console.log('fetchIceServers err ', err)
        }
    }

    return {
        fetchIceServers,
        peerConnections,
        dataChannels,
        mediaStreams
    }
})