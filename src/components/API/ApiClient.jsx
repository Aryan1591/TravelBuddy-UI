import axios from 'axios'

export const apiClient = axios.create(
    {
        baseURL: 'https://travelbuddy-user-service-production.up.railway.app/'
    }
);