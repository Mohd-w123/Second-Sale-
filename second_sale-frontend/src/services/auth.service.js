import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phoneOrPayload, otp, sessionId, name, email) => 
    typeof phoneOrPayload === 'object' && phoneOrPayload !== null
      ? api.post('/auth/verify-otp', phoneOrPayload)
      : api.post('/auth/verify-otp', { phone: phoneOrPayload, otp, sessionId, name, email }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};
