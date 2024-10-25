import {Ref, ref} from "vue";


const   userId = ref(Date.now())
const   name= ref('somename')
const   role= ref(0)
// @ts-ignore
const   userStream:Ref<MediaStream> = ref()
export const useCurrentUser = () => {
    const initUserStream = async ()=> {
        userStream.value =  await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return userStream.value
    }

    return {
        initUserStream,
        userStream,
        userId,
        name,
        role,
    }
}