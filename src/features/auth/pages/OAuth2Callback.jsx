import {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../../context/AuthContext';

export function OAuth2Callback() {
    const navigate = useNavigate();
    const processed = useRef(false);
    const { loginWithOAuth, user } = useAuth();

    useEffect(() => {
        if (processed.current) {
            return;
        }

        processed.current = true;

        const params = new URLSearchParams(window.location.search);

        const token = params.get('token');
        const email = params.get('email');

        if (token) {
            loginWithOAuth(token, email);
        }
    }, [loginWithOAuth]);

    useEffect(() => {
        if (user) {
            navigate('/habit-tracker', { replace: true });
        }
    }, [user, navigate]);

    return <div>Signing you in...</div>;
}