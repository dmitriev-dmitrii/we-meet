import {computed, nextTick, ref, unref} from "vue";
import adapter from 'webrtc-adapter';
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs'

function setCookie(name, value, options = {}) {
// todo унести отсюда куки
    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}



const   userName= ref(adapter.browserDetails.browser);
const   userId = ref('');

const   isVideoOn = ref(true);
const   isAudioOn = ref(true);


const   userStream = ref( '');

export const useCurrentUser = () => {
    const initUserStream = async ()=> {
    try {

      const userLocalStream =  await window.navigator.mediaDevices.getUserMedia({ video:unref(isVideoOn) , audio: unref(isAudioOn) });
      const tracks =   userLocalStream.getTracks()
        console.log('tracks',tracks)
        // @ts-ignore
        userStream.value  =  userLocalStream


      }

        catch (e) {
            console.log('initUserStream',e)
       }

    }

    const saveUser = async ()=> {
        // TODO нужен ли  Fingerprint
        // TODO забахать авторизацию
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        userId.value = result.visitorId

        setCookie('userId', result.visitorId);
        setCookie('userName', unref(userName));


        // const url = 'http://localhost:3000/api/users/save'
        //
        // const payload = {
        //     userName: unref(userName),
        //     userId: unref(userId)
        // }
        //
        // const {data} = await axios.post(url, payload)
        //
        // return data
    }


    return {
        isAudioOn,
        isVideoOn,
        saveUser,
        initUserStream,
        userStream,
        userId,
        userName
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
