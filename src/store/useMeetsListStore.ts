import {ref} from 'vue'
import {meetApi} from "@/api/meetApi";

const meetsList = ref([])

export const useMeetsListStore = () => {

    const fetchMeetsList = async () => {
        const {data} = await meetApi.getMeetList()

        meetsList.value = data
    }

    return {
        fetchMeetsList,
        meetsList,
    }
}