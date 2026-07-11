const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

// Wrapper to catch network-level errors (backend unreachable, CORS blocked, etc.)
const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    // TypeError: Failed to fetch — backend is down or CORS is blocking
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the server. Please check that the backend is running and try again.'
      );
    }
    throw err;
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
  getMyActive: () =>
    safeFetch(`${API_URL}/my-prayers/active`, { headers: getHeaders() }).then(handleResponse),
  getMyAnswered: () =>
    safeFetch(`${API_URL}/my-prayers/answered`, { headers: getHeaders() }).then(handleResponse),

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
