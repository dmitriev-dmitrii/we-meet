import {createGlobalState} from "@vueuse/core";
import {shallowRef} from "vue";

export const useWebRtcStore = createGlobalState(() => {

     const peerConnections = shallowRef({});
     const dataChannels = shallowRef({});
     const mediaStreams = shallowRef({});


    return {
        peerConnections,
        dataChannels,
        mediaStreams
    }
})