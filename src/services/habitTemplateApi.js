import {api} from './client';

export const habitTemplateApi = {
    getAll: () =>
        api.get('/api/habit-templates').then((r) => r.data),

    getById: (id) =>
        api.get(`/api/habit-templates/${id}`).then((r) => r.data),

    create: (data) =>
        api.post('/api/habit-templates', data).then((r) => r.data),

    update: (id, data) =>
        api.put(`/api/habit-templates/${id}`, data).then((r) => r.data),

    delete: (id) =>
        api.delete(`/api/habit-templates/${id}`).then((r) => r.data),
};