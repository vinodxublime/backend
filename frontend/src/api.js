/*export const baseUrl = 'http://localhost:5000'; // centralized base URL

export async function fetchFromBackend(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
}*/

export const baseUrl = 'http://localhost:5000'; // Backend base URL

/**
 * Centralized fetch wrapper that handles:
 * - Attaching auth token
 * - JSON request/response
 * - Error handling
 */
export async function fetchFromBackend(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), // Add token if present
    ...options.headers, // Allow overriding
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Optional: improve error reporting
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }

  return response.json();
}
