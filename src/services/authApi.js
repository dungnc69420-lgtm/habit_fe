import { api } from './client';

export const authApi = {
  register: (body) =>
      api.post('/api/auth/register', body)
          .then((res) => res.data),

  login: (body) =>
      api.post('/api/auth/login', body)
          .then((res) => res.data),
};