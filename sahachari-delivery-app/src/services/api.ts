import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export interface AuthPayload {
    email: string;
    password: string;
    name?: string;
    pincodes?: string[];
}

export const api = {
    async login(payload: AuthPayload) {
        const { data } = await client.post('/auth/login', payload);
        // If server returns a token, persist it for authenticated requests
        if (data?.token) {
            await AsyncStorage.setItem('token', data.token);
        }
        // Prefer returning the user object if present, otherwise return raw data
        return data.user ?? data;
    },

    async signup(payload: AuthPayload) {
        const { data } = await client.post('/auth/signup', payload);
        if (data?.token) {
            await AsyncStorage.setItem('token', data.token);
        }
        return data.user ?? data;
    },
};
