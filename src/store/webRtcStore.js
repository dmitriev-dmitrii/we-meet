import {createGlobalState} from "@vueuse/core";
import {shallowRef, unref} from "vue";
import {usersApi} from "@/api/usersApi.js";

export const useWebRtcStore = createGlobalState(() => {


     const peerConnections ={};
     const dataChannels = {};
     const mediaStreams = {};

    const iceServers = shallowRef([]);

    const fetchIceServers = async (coturn) => {
        try {

            if (unref(iceServers).length) {
                return
            }

            const {data} = await usersApi.getIceServers(coturn)
            console.log(iceServers)
            iceServers.value = data

        } catch (err) {
            console.log('fetchIceServers err ', err)
        }
    }

    return {
        iceServers,
        fetchIceServers,
        peerConnections,
        dataChannels,
        mediaStreams
    }
})