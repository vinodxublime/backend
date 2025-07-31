import api, { handleApiError } from './index';

/**
 * Get all resources with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.programId - Filter by program ID
 * @param {string} params.type - Filter by resource type
 * @param {string} params.search - Search term
 * @returns {Promise} - Promise with resources data
 */
export const getResources = async (params = {}) => {
  try {
    const response = await api.get('/resources', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get resource details by ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise} - Promise with resource details
 */
export const getResource = async (resourceId) => {
  try {
    const response = await api.get(`/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create a new resource (admin/moderator only)
 * @param {Object} resourceData - Resource data
 * @returns {Promise} - Promise with created resource data
 */
export const createResource = async (resourceData) => {
  try {
    // Use FormData for file uploads
    const formData = new FormData();
    
    // Append all resource data to FormData
    Object.keys(resourceData).forEach(key => {
      if (key === 'file') {
        formData.append('file', resourceData.file);
      } else {
        formData.append(key, resourceData[key]);
      }
    });
    
    const response = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update an existing resource (admin/moderator only)
 * @param {string} resourceId - Resource ID
 * @param {Object} resourceData - Updated resource data
 * @returns {Promise} - Promise with updated resource data
 */
export const updateResource = async (resourceId, resourceData) => {
  try {
    // Use FormData for file uploads
    const formData = new FormData();
    
    // Append all resource data to FormData
    Object.keys(resourceData).forEach(key => {
      if (key === 'file' && resourceData.file) {
        formData.append('file', resourceData.file);
      } else {
        formData.append(key, resourceData[key]);
      }
    });
    
    const response = await api.put(`/resources/${resourceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete a resource (admin only)
 * @param {string} resourceId - Resource ID
 * @returns {Promise} - Promise with deletion response
 */
export const deleteResource = async (resourceId) => {
  try {
    const response = await api.delete(`/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Download a resource
 * @param {string} resourceId - Resource ID
 * @returns {Promise} - Promise with download URL
 */
export const downloadResource = async (resourceId) => {
  try {
    const response = await api.get(`/resources/${resourceId}/download`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark a resource as viewed/downloaded
 * @param {string} resourceId - Resource ID
 * @returns {Promise} - Promise with response data
 */
export const markResourceViewed = async (resourceId) => {
  try {
    const response = await api.post(`/resources/${resourceId}/view`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user's resource history
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise} - Promise with resource history data
 */
export const getResourceHistory = async (params = {}) => {
  try {
    const response = await api.get('/user/resources', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};