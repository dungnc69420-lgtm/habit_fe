import axios from 'axios';

const BASE_URL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:8080/api';

// Create an API request with headers
export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Include the access token for each API request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Act as a global exception handling
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Unexpected error';

        switch (status) {
            case 400:
                console.error('Bad Request:', message);
                break;

            case 401:
                console.error('Unauthorized:', message);

                localStorage.removeItem('token');
                localStorage.removeItem('user');

                window.location.href = '/login';
                break;

            case 403:
                console.error('Forbidden:', message);
                break;

            case 404:
                console.error('Not Found:', message);
                break;

            case 500:
                console.error('Server Error:', message);
                break;

            default:
                console.error(message);
        }

        return Promise.reject(error);
    }
);