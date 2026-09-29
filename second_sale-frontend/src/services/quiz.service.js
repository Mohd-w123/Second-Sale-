import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const quizService = {
  // Public
  getQuizByCategory: async (category) => {
    const res = await api.get(`/quiz/${category}`);
    return res.data;
  },

  // Admin
  getAllQuizCategories: async () => {
    const res = await api.get('/quiz/admin/all', getAuthHeaders());
    return res.data;
  },

  updateQuizByCategory: async (category, data) => {
    const res = await api.put(`/quiz/admin/${category}`, data, getAuthHeaders());
    return res.data;
  },

  resetQuizToDefaults: async (category) => {
    const res = await api.post(`/quiz/admin/${category}/reset`, {}, getAuthHeaders());
    return res.data;
  },
};

export default quizService;
