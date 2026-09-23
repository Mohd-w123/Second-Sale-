import api from './api';

export const quizService = {
  // Public
  getQuizByCategory: async (category) => {
    const res = await api.get(`/quiz/${category}`);
    return res.data;
  },

  // Admin
  getAllQuizCategories: async () => {
    const res = await api.get('/quiz/admin/all');
    return res.data;
  },

  updateQuizByCategory: async (category, data) => {
    const res = await api.put(`/quiz/admin/${category}`, data);
    return res.data;
  },

  resetQuizToDefaults: async (category) => {
    const res = await api.post(`/quiz/admin/${category}/reset`);
    return res.data;
  },
};

export default quizService;
