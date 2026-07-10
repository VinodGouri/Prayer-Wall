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

const api = {
  // Auth
  login: (body) =>
    fetch(`${API_URL}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  register: (body) =>
    fetch(`${API_URL}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  googleLogin: (body) =>
    fetch(`${API_URL}/auth/google`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  updateProfile: (body) =>
    fetch(`${API_URL}/auth/profile`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getMe: () =>
    fetch(`${API_URL}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  // Prayers
  getPrayers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/prayers?${query}`, { headers: getHeaders() }).then(handleResponse);
  },
  createPrayer: (body) =>
    fetch(`${API_URL}/prayers`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  prayFor: (id) =>
    fetch(`${API_URL}/prayers/${id}/pray`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
  markAnswered: (id) =>
    fetch(`${API_URL}/prayers/${id}/answered`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
  undoAnswered: (id) =>
    fetch(`${API_URL}/prayers/${id}/undo-answered`, { method: 'POST', headers: getHeaders() }).then(handleResponse),

  // My Prayers
  getMyActive: () =>
    fetch(`${API_URL}/my-prayers/active`, { headers: getHeaders() }).then(handleResponse),
  getMyAnswered: () =>
    fetch(`${API_URL}/my-prayers/answered`, { headers: getHeaders() }).then(handleResponse),

  // Testimonials
  getTestimonials: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/testimonials?${query}`, { headers: getHeaders() }).then(handleResponse);
  },
  submitTestimony: (body) =>
    fetch(`${API_URL}/testimonials`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Categories
  getCategories: () =>
    fetch(`${API_URL}/categories`, { headers: getHeaders() }).then(handleResponse),

  // Admin
  getDashboard: () =>
    fetch(`${API_URL}/admin/dashboard`, { headers: getHeaders() }).then(handleResponse),
  getPendingTestimonies: () =>
    fetch(`${API_URL}/admin/testimonials/pending`, { headers: getHeaders() }).then(handleResponse),
  approveTestimony: (id) =>
    fetch(`${API_URL}/admin/testimonials/${id}/approve`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
  rejectTestimony: (id) =>
    fetch(`${API_URL}/admin/testimonials/${id}/reject`, { method: 'PATCH', headers: getHeaders() }).then(handleResponse),
  deletePrayer: (id) =>
    fetch(`${API_URL}/admin/prayers/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
  updatePrayer: (id, body) =>
    fetch(`${API_URL}/admin/prayers/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

export default api;
