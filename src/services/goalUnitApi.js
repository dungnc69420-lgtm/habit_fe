import {api} from './client';

export const goalUnitApi = {
    getAll: () => api.get('/api/goal-units/default').then((r) => r.data),
};