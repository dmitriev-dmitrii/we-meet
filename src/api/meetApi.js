import axios from "axios";

const MEET_API_URL = import.meta.env.VITE_WE_MEET_API_URL;

const createMeet = () => {

    const payload = {}

    return axios.post(`${MEET_API_URL}/api/meet/create`, payload)

}


const getMeetById = ({meetId}) => {
    return axios.get(`${MEET_API_URL}/api/meet/${meetId}`)
}

const meetJoinRequest = ({meetId}) => {
    const payload = {}
    return axios.post(`${MEET_API_URL}/api/meet/${meetId}/join-request`, payload)
}

export const meetApi = Object.freeze({
    createMeet,
    getMeetById,
    meetJoinRequest,
})