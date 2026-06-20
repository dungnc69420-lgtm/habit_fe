import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Failed to restore auth state', error);

            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login({
            email,
            password,
        });

        const userData = data.user ?? { email };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const register = async (name, email, password) => {
        const data = await authApi.register({
            name,
            email,
            password,
        });

        const userData = data.user ?? {
            name,
            email,
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const loginWithOAuth = (token, email) => {
        const userData = {
            email: email ?? '',
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            register,
            loginWithOAuth,
            logout,
        }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}