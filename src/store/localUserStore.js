import adapter from "webrtc-adapter";
import {mediaStreams} from "@/store/webRtcStore.js";

export default {

    userId : adapter.browserDetails.browser,

    userName : 'hui',

    get audio() {
        try {
            return mediaStreams[this.userId].getAudioTracks().some((item) => item.enabled)
        } catch (e) {
            console.log('audio get err', e)
            return false
        }
    },

    set audio(value) {
        try {
            mediaStreams[this.userId].getAudioTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value

            return value
        } catch (e) {
            console.log('audio set err', e)
            return false
        }
    },

    get video() {
        try {
            return mediaStreams[this.userId].getVideoTracks().some((item) => item.enabled)
        } catch (e) {
            console.log('video get err', e)
            return false
        }
    },

    set video(value) {
        try {
            mediaStreams[this.userId].getVideoTracks().find(({readyState}) => {
                return readyState === 'live'
            }).enabled = !!value

            return value
        } catch (e) {
            console.log('video set err', e)
            return false
        }
    }
}