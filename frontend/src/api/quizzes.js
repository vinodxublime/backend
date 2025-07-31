import api, { handleApiError } from './index';

/**
 * Get all quizzes with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.programId - Filter by program ID
 * @returns {Promise} - Promise with quizzes data
 */
export const getQuizzes = async (params = {}) => {
  try {
    const response = await api.get('/quizzes', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get quiz details by ID
 * @param {string} quizId - Quiz ID
 * @returns {Promise} - Promise with quiz details
 */
export const getQuiz = async (quizId) => {
  try {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create a new quiz (admin/moderator only)
 * @param {Object} quizData - Quiz data
 * @returns {Promise} - Promise with created quiz data
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update an existing quiz (admin/moderator only)
 * @param {string} quizId - Quiz ID
 * @param {Object} quizData - Updated quiz data
 * @returns {Promise} - Promise with updated quiz data
 */
export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete a quiz (admin only)
 * @param {string} quizId - Quiz ID
 * @returns {Promise} - Promise with deletion response
 */
export const deleteQuiz = async (quizId) => {
  try {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Start a quiz attempt
 * @param {string} quizId - Quiz ID
 * @returns {Promise} - Promise with quiz attempt data
 */
export const startQuizAttempt = async (quizId) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/attempts`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Submit quiz answers
 * @param {string} quizId - Quiz ID
 * @param {string} attemptId - Attempt ID
 * @param {Object} answers - Quiz answers
 * @returns {Promise} - Promise with quiz results
 */
export const submitQuizAnswers = async (quizId, attemptId, answers) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, { answers });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get quiz attempt results
 * @param {string} quizId - Quiz ID
 * @param {string} attemptId - Attempt ID
 * @returns {Promise} - Promise with quiz attempt results
 */
export const getQuizAttemptResults = async (quizId, attemptId) => {
  try {
    const response = await api.get(`/quizzes/${quizId}/attempts/${attemptId}/results`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user's quiz history
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise} - Promise with quiz history data
 */
export const getQuizHistory = async (params = {}) => {
  try {
    const response = await api.get('/user/quizzes', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};