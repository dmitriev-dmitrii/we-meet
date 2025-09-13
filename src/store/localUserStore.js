import {usersApi} from "@/api/usersApi.js";
import {ref} from "vue";
import {createGlobalState} from "@vueuse/core";

export const useLocalUserStore = createGlobalState(() => {

    const localUserId = ref('');
    const localUserName = ref('');
    const localUserIsConnectedToMeet = ref(false);

    const setLocalUserIsConnected = (val) => {
        //ws is connected

        localUserIsConnectedToMeet.value = !!val
    }

    const auth = async ({userName = ''} = {}) => {
        const {data} = await usersApi.userAuth({userName})

        localUserId.value = data.userId
        localUserName.value = data.userName
        return data
    }

    return {
        localUserIsConnectedToMeet,
        localUserId,
        localUserName,
        setLocalUserIsConnected,
        auth,
    }
})
