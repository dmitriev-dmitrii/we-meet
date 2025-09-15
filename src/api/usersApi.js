import {axiosInstance} from "@/api/config/axiosInstance.js";


const USERS_API_URL = '/api/users';

const userAuth = (payload) => {
    return axiosInstance.post(`${USERS_API_URL}/auth`, payload)
}

const getIceServers = (coturn='') => {
    return axiosInstance.get(`${USERS_API_URL}/ice-servers?coturn=${coturn}`)
}

export const usersApi = {
    userAuth,
    getIceServers
}