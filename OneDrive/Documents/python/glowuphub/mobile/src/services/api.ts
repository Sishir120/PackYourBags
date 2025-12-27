import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we might just clear the token
            await AsyncStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: (endpoints: string, data: any) => api.post(endpoints, data),
    register: (endpoints: string, data: any) => api.post(endpoints, data),
    me: () => api.get('/user'),
};

export default api;
