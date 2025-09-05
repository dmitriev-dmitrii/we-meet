import axios from "axios";
import {errorParseInterceptor} from "@/api/config/errorParseInterceptor.js";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_WE_MEET_API_URL,

});

axiosInstance.interceptors.response.use(
    (res) => {

        return res;
    }, (err) => {

        
        return Promise.reject(errorParseInterceptor(err))
    }
);

export {axiosInstance};
