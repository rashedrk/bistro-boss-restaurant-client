import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth";


const useAxiosSecure = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const axiosSecure = axios.create({
        baseURL: 'http://localhost:5000',
    });

    useEffect(() => {
        axiosSecure.interceptors.request.use((config) => {
            // Retrieve the access token from localStorage
            const token = localStorage.getItem('access_token');
            if(token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        });
        axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                if(error.response && (error.response.status === 401 || error.response.status === 403)) {
                    await logout();
                    navigate('/login')
                }
                return Promise.reject(error);
            }
        );
    },[logout, navigate])

    return [axiosSecure];
};

export default useAxiosSecure;