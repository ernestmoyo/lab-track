const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('labtrack_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getProfile: () => request('/auth/profile'),

  // Samples
  getSamples: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/samples${qs ? `?${qs}` : ''}`);
  },
  getSample: (id) => request(`/samples/${id}`),
  createSample: (data) => request('/samples', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSample: (id, data) => request(`/samples/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteSample: (id) => request(`/samples/${id}`, { method: 'DELETE' }),

  // Tests
  getTests: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tests${qs ? `?${qs}` : ''}`);
  },
  getTest: (id) => request(`/tests/${id}`),
  createTest: (data) => request('/tests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTest: (id, data) => request(`/tests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),
};

export default api;
