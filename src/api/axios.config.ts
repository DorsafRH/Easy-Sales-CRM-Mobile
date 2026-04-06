import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'crm_access_token';
export const USER_KEY  = 'crm_current_user';

// En dev avec émulateur Android : 10.0.2.2 = localhost de la machine hôte
// En dev avec appareil physique : IP locale de la machine hôte
const BASE_URL = __DEV__
  ? 'http://10.169.25.88:8080/api'
  : 'https://api.votre-domaine.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT dans chaque requête
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Gère les 401 (token expiré)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    }
    return Promise.reject(error);
  }
);

export default apiClient;