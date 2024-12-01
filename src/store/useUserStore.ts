// @ts-nocheck
import {computed, ref, unref} from "vue";
import axios from "axios";
import {defineStore} from "pinia";
import {useWebSocket} from "@/features/useWebSocket";

export const useUserStore = defineStore('userStore', () => {
    const { currentWebSocketState ,    connectToWebSocket, closeWebSocket  } = useWebSocket();

    const   userName= ref('');
    const   userId = ref('');

    const isAuth = computed(()=> {
        return Boolean(( unref(currentWebSocketState) === WebSocket.OPEN ) && unref(userId) && unref(userName))
    })

    const sendAuthRequest = async (payload)=> {

        if (unref( userId )  ) {
            return
        }

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/users/auth'

        const { data} = await axios.post(url, payload,   {
            withCredentials: true
        })

        userId.value = data.userId
        userName.value = data.userName

        // sessionStorage.setItem( 'userId', data.userId );

        await connectToWebSocket()
    }

    const sendLogoutRequest = async ()=> {

        const url = import.meta.env.VITE_WE_MEET_API_URL + '/api/users/logout'

      const { data} =   await axios.get(url, {
            withCredentials: true
        })


        userId.value = ''
        userName.value = ''

        if (!data.isDeleted) {
            await  closeWebSocket()
        }

    }


    return {
        sendAuthRequest,
        sendLogoutRequest,
        isAuth,
        userId,
        userName,
    }
})



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
