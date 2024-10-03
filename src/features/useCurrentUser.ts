import {ref} from "vue";
import adapter from 'webrtc-adapter';

const   userId = ref(Date.now())
const   name= ref(adapter.browserDetails.browser)
const   role= ref(0)
const   userStream= ref()
export const useCurrentUser = () => {
    const initUserStream = async ()=> {
        userStream.value =  await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }

    return {
        initUserStream,
        userStream,
        userId,
        name,
        role,
    }
}