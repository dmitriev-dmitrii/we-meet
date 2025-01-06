// @ts-nocheck
import {computed, ref, unref} from "vue";
import {defineStore} from "pinia";
import {useMeetStore} from "@/store/useMeetStore";

export const useUserStore = defineStore('userStore', () => {
    const meetStore = useMeetStore()

    const   userName= ref('');
    const   userId = ref('');


    const isUserConnectedMeet = computed(()=> {
      return   unref(meetStore.meetUsersId.includes(unref(userId)))
    })


    return {
        isUserConnectedMeet,
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
