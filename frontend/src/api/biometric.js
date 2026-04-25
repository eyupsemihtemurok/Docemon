import axios from 'axios';
import { getAuthToken } from '../services/authStorage';
import { getApiBaseUrl } from '../services/httpClient';

const API_URL = getApiBaseUrl();

const biometricApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Her istekte token eklemek için interceptor
biometricApi.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Yeni biometrik kullanıcı kaydı
 * @param {FormData} formData - { NationalId, FullName, Email, Password, FaceImage }
 */
export const registerBiometric = (formData) => {
  return biometricApi.post('/api/biometric/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Sahadan afetzede tanılama fotoğrafı yükleme
 * @param {FormData} formData - { FaceImage, HealthDetails, LocationDetails }
 */
export const uploadRescuePhoto = (formData) => {
  return biometricApi.post('/api/biometric/rescue-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Operatör için bekleyen doğrulamaları getir
 */
export const getPendingVerifications = () => {
  return biometricApi.get('/api/biometric/pending-verifications');
};

/**
 * Operatör eşleşme onayı/reddi
 * @param {Object} data - { verificationId, status: 'APPROVED' | 'REJECTED' }
 */
export const approveVerification = (data) => {
  return biometricApi.post('/api/biometric/operator-approve', data);
};

export default biometricApi;
