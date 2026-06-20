import {api} from './client';

export const habitCategoryApi = {
    getAll: () => api.get('/api/habit-categories').then((r) => r.data),
};