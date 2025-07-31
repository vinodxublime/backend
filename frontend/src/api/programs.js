import api, { handleApiError } from './index';

/**
 * Get all programs with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.category - Filter by category
 * @param {string} params.search - Search term
 * @param {string} params.level - Filter by level (beginner, intermediate, advanced)
 * @param {boolean} params.featured - Filter by featured status
 * @returns {Promise} - Promise with programs data
 */
export const getPrograms = async (params = {}) => {
  try {
    const response = await api.get('/programs', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get program details by ID
 * @param {string} programId - Program ID
 * @returns {Promise} - Promise with program details
 */
export const getProgram = async (programId) => {
  try {
    const response = await api.get(`/programs/${programId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create a new program (admin/moderator only)
 * @param {Object} programData - Program data
 * @returns {Promise} - Promise with created program data
 */
export const createProgram = async (programData) => {
  try {
    const response = await api.post('/programs', programData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update an existing program (admin/moderator only)
 * @param {string} programId - Program ID
 * @param {Object} programData - Updated program data
 * @returns {Promise} - Promise with updated program data
 */
export const updateProgram = async (programId, programData) => {
  try {
    const response = await api.put(`/programs/${programId}`, programData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete a program (admin only)
 * @param {string} programId - Program ID
 * @returns {Promise} - Promise with deletion response
 */
export const deleteProgram = async (programId) => {
  try {
    const response = await api.delete(`/programs/${programId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Enroll in a program
 * @param {string} programId - Program ID
 * @returns {Promise} - Promise with enrollment response
 */
export const enrollProgram = async (programId) => {
  try {
    const response = await api.post(`/programs/${programId}/enroll`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Unenroll from a program
 * @param {string} programId - Program ID
 * @returns {Promise} - Promise with unenrollment response
 */
export const unenrollProgram = async (programId) => {
  try {
    const response = await api.delete(`/programs/${programId}/enroll`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get program progress
 * @param {string} programId - Program ID
 * @returns {Promise} - Promise with program progress data
 */
export const getProgramProgress = async (programId) => {
  try {
    const response = await api.get(`/programs/${programId}/progress`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark a module as complete
 * @param {string} programId - Program ID
 * @param {string} moduleId - Module ID
 * @returns {Promise} - Promise with module completion response
 */
export const markModuleComplete = async (programId, moduleId) => {
  try {
    const response = await api.post(`/programs/${programId}/modules/${moduleId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get enrolled programs for current user
 * @returns {Promise} - Promise with enrolled programs data
 */
export const getEnrolledPrograms = async () => {
  try {
    const response = await api.get('/user/programs');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};