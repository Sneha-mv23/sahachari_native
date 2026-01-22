import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';

export async function setToken(value: string): Promise<void> {
    try {
        // Use SecureStore when available
        if (SecureStore && SecureStore.setItemAsync) {
            await SecureStore.setItemAsync(TOKEN_KEY, value);
            return;
        }
    } catch (e) {
        // ignore and fallback
        // eslint-disable-next-line no-console
        console.warn('[secureToken] SecureStore.setItemAsync failed, falling back to AsyncStorage', e);
    }

    await AsyncStorage.setItem(TOKEN_KEY, value);
}

export async function getToken(): Promise<string | null> {
    try {
        if (SecureStore && SecureStore.getItemAsync) {
            const v = await SecureStore.getItemAsync(TOKEN_KEY);
            if (v != null) return v;
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[secureToken] SecureStore.getItemAsync failed, falling back to AsyncStorage', e);
    }

    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
        return null;
    }
}

export async function deleteToken(): Promise<void> {
    try {
        if (SecureStore && SecureStore.deleteItemAsync) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[secureToken] SecureStore.deleteItemAsync failed, falling back to AsyncStorage', e);
    }

    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        // ignore
    }
}
