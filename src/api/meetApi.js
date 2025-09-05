import {axiosInstance} from "@/api/config/axiosInstance.js";


const MEET_API_URL =  '/api/meet';

const createMeet = (payload) => {

    return axiosInstance.post(`${MEET_API_URL}/create`, payload)

}

const getMeetById = ({meetId}) => {
    return axiosInstance.get(`${MEET_API_URL}/${meetId}`)
}

const  joinMeetRequest = ({meetId , userName , userId}) => {
    const payload = { userName , userId }
    return axiosInstance.post(`${MEET_API_URL}/${meetId}/join-request`, payload)
}

export const meetApi = {
    createMeet,
    getMeetById,
    joinMeetRequest,
}