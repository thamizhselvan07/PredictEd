import axios from 'axios';

const api = axios.create({
    baseURL: '', // Relative path for unified deployment
});

export const getNextQuestion = (userId) => api.get(`/quiz/next?user_id=${userId}`);
export const submitAnswer = (user_id, data) => api.post(`/quiz/submit?user_id=${user_id}`, data);
export const getDashboardStats = (userId) => api.get(`/dashboard/stats?user_id=${userId}`);
export const resetQuiz = (userId) => api.post(`/quiz/reset?user_id=${userId}`);
export const chatWithTutor = (message) => api.post('/chat/tutor', { message });

export default api;