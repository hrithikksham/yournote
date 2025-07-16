import * as SecureStore from 'expo-secure-store';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync('user_token', token);
}

export async function getToken() {
  return await SecureStore.getItemAsync('user_token');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('user_token');
}