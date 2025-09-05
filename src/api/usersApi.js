import {axiosInstance} from "@/api/config/axiosInstance.js";


const USERS_API_URL = '/api/users';

const userAuth = (payload) => {
    return axiosInstance.post(`${USERS_API_URL}/auth`, payload)
}

const getIceServers = () => {
    return axiosInstance.get(`${USERS_API_URL}/ice-servers`)
}

export const usersApi = {
    userAuth,
    getIceServers
}