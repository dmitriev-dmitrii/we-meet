import {computed, ref, unref} from "vue";
import adapter from 'webrtc-adapter';
import axios from "axios";
import {MEET_WEB_SOCKET_EVENTS} from "@/constatnts/meetWebSocket";

import {useWebSocket  } from "@/features/useWebSocket";

const {connectToWebSocket, currentWebSocketState,sendWebSocketMessage} = useWebSocket()

const   userName= ref(adapter.browserDetails.browser);
const   userId = ref('');

const userIsAuth = computed(()=> {
    return Boolean(unref(userId) && unref(userName)  && unref(currentWebSocketState)=== WebSocket.OPEN  )
})

const   isVideoOn = ref(true);
const   isAudioOn = ref(true);

const   userStream = ref( '');

export const useCurrentUser = () => {

    const initUserStream = async ()=> {

    try {

        userStream.value  =  await window.navigator.mediaDevices.getUserMedia({
            video: unref(isVideoOn),
            audio: unref(isAudioOn)
        })
      }

        catch (e) {
            console.log('initUserStream',e)
       }

    }

    const userAuth = async ()=> {

        await  initUserStream()

        if (unref( userIsAuth)  ) {
            return
        }

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/users/auth'

        const payload = {
            userName: unref(userName),
        }

        const { data} = await axios.post(url, payload,   {
            withCredentials: true
        })

        userId.value = data.userId
        userName.value = data.userName

        await connectToWebSocket()
    }

    return {
        isAudioOn,
        isVideoOn,
        userAuth,
        userIsAuth,
        initUserStream,
        userStream,
        userId,
        userName,
    }
}

// stopVideo.addEventListener("click", () => {
//   const enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     html = `<i class="fas fa-video-slash"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   } else {
//     myVideoStream.getVideoTracks()[0].enabled = true;
//     html = `<i class="fas fa-video"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   }
// });
