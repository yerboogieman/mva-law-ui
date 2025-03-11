import axios from "axios";
import {BASE_URL} from "../Constants";
import jb_utils from "./functions.jsx";

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers
});

axiosInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token') || false;
    if (token) {
        config.headers['Authorization'] = "Bearer " + token;
    }

    return config;
});

axiosInstance.interceptors.response.use(function (response) {

    if (!response.data) {
        response.data = {};
    }

    // if it's a success, it'll be 2xx code
    if (response.status >= 200 || response.status < 300) {

        // convert non objects to objects
        if (typeof response.data !== "object" || Array.isArray(response.data)) {
            const data = response.data;
            response.data = {
                success: true,
                data
            };
        } else {
            response.data.success = true;
        }

        return jb_utils.deep_freeze(response.data);
    }

    response.data.success = false;

    return jb_utils.deep_freeze(response);

}, function (error) {

    const {response} = error;
    response.data.success = false;
    const {data} = response;

    // set up error message
    const {detail} = response.data;

    if (typeof detail === "string") {
        data.message = detail;
    } else if (typeof detail === "object" && detail.message) {
        data.message = detail.message;
    } else {
        data.message = "There was an error processing this request.";
    }

    return data;
});