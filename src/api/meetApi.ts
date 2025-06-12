import axios from "axios";

const MEET_API_URL = import.meta.env.VITE_WE_MEET_API_URL + '/api/meet';

const createMeet = (payload) => {

    return axios.post(`${MEET_API_URL}/create`, payload)

}

const getMeetById = ({meetId}) => {
    return axios.get(`${MEET_API_URL}/${meetId}`)
}

const getMeetList = () => {
    return axios.get(`${MEET_API_URL}/meet-list`)
}


const  joinMeetRequest = ({meetId , userName , userId}) => {
    const payload = { userName , userId }
    return axios.post(`${MEET_API_URL}/${meetId}/join-request`, payload)
}

export const meetApi = {
    getMeetList,
    createMeet,
    getMeetById,
    joinMeetRequest,
}