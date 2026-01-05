import axios from 'axios';

const api = axios.create({
    baseURL: '', // Relative path for unified deployment
});

// Auth
export const login = (data) => api.post('/api/auth/login', data);
export const signup = (data) => api.post('/api/auth/signup', data);
export const verifyEmail = (data) => api.post('/api/auth/verify', data);

export const getNextQuestion = (userId, quizId = null, subjectId = null) => {
    let url = `/quiz/next?user_id=${userId}`;
    if (quizId) url += `&quiz_id=${quizId}`;
    if (subjectId) url += `&subject_id=${subjectId}`;
    return api.get(url);
};
export const submitAnswer = (user_id, data) => api.post(`/quiz/submit?user_id=${user_id}`, data);
export const getDashboardStats = (userId) => api.get(`/dashboard/stats?user_id=${userId}`);
// Multi-Stream Hierarchy
export const getStreams = () => api.get('/streams');
export const getExams = (streamId) => api.get(`/exams?stream_id=${streamId}`);
export const getSubjects = (examId) => api.get(`/subjects?exam_id=${examId}`);

export const getQuizTypes = () => api.get('/quiz-types');
export const startQuizSession = (subjectId, type, userId) => api.post(`/quiz/start?user_id=${userId}`, { subject_id: subjectId, type });
export const startMockExam = (examId, userId) => api.post(`/exam/${examId}/start_mock?user_id=${userId}`);
export const getNextQuestionForAttempt = (attemptId) => api.get(`/quiz/${attemptId}/next`);
export const getAdaptiveQuestion = (subjectId, attemptId, userId) => api.get(`/quiz/question/next?subject_id=${subjectId}&attempt_id=${attemptId}&user_id=${userId}`);


export const resetQuiz = (userId) => api.post(`/quiz/reset?user_id=${userId}`);
export const chatWithTutor = (message) => api.post('/chat/tutor', { message });

export default api;