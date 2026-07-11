const isLocalhost = typeof window !== 'undefined' && 
  window.location.hostname && 
  (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));

const API_URL = isLocalhost
  ? 'http://localhost:8080/api'
  : (import.meta.env.VITE_API_URL || 'https://prayer-wall-backend-production.up.railway.app/api');

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// Wrapper to catch network-level errors with automatic retry for transient failures
// (e.g. Railway cold starts, temporary network hiccups)
const safeFetch = async (url, options, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      const isNetworkError = err instanceof TypeError && err.message.includes('fetch');
      // If it's a network error and we have retries left, wait and try again
      if (isNetworkError && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // 1s, 2s backoff
        continue;
      }
      // Final attempt failed
      if (isNetworkError) {
        throw new Error(
          'Unable to connect to the server. Please try again in a moment.'
        );
      }
      throw err;
    }
  }
};

const api = {
  // Auth
  login: (body) =>
    safeFetch(`${API_URL}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  register: (body) =>
    safeFetch(`${API_URL}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  googleLogin: (body) =>
    safeFetch(`${API_URL}/auth/google`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  updateProfile: (body) =>
    safeFetch(`${API_URL}/auth/profile`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  changePassword: (body) =>
    safeFetch(`${API_URL}/auth/change-password`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getMe: () =>
    safeFetch(`${API_URL}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  // Prayers
  getPrayers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_URL}/prayers?${query}`, { headers: getHeaders() }).then(handleResponse);
  },
  createPrayer: (body) =>
    safeFetch(`${API_URL}/prayers`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  prayFor: (id) =>
    safeFetch(`${API_URL}/prayers/${id}/pray`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
  markAnswered: (id) =>
    safeFetch(`${API_URL}/prayers/${id}/answered`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
  undoAnswered: (id) =>
    safeFetch(`${API_URL}/prayers/${id}/undo-answered`, { method: 'POST', headers: getHeaders() }).then(handleResponse),

  // My Prayers
  getMyActive: (ids) =>
    safeFetch(`${API_URL}/my-prayers/active${ids ? `?ids=${ids.join(',')}` : ''}`, { headers: getHeaders() }).then(handleResponse),
  getMyAnswered: (ids) =>
    safeFetch(`${API_URL}/my-prayers/answered${ids ? `?ids=${ids.join(',')}` : ''}`, { headers: getHeaders() }).then(handleResponse),

  // Testimonials
  getTestimonials: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_URL}/testimonials?${query}`, { headers: getHeaders() }).then(handleResponse);
  },
  submitTestimony: (body) =>
    safeFetch(`${API_URL}/testimonials`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Categories
  getCategories: () =>
    safeFetch(`${API_URL}/categories`, { headers: getHeaders() }).then(handleResponse),

  // Admin
  getDashboard: () =>
    safeFetch(`${API_URL}/admin/dashboard`, { headers: getHeaders() }).then(handleResponse),
  getPendingTestimonies: () =>
    safeFetch(`${API_URL}/admin/testimonials/pending`, { headers: getHeaders() }).then(handleResponse),
  approveTestimony: (id) =>
    safeFetch(`${API_URL}/admin/testimonials/${id}/approve`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
  rejectTestimony: (id) =>
    safeFetch(`${API_URL}/admin/testimonials/${id}/reject`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
  deletePrayer: (id) =>
    safeFetch(`${API_URL}/admin/prayers/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
  updatePrayer: (id, body) =>
    safeFetch(`${API_URL}/admin/prayers/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

export default api;
