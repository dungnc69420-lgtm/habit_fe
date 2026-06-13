import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode
} from 'react';
import {authApi} from '../services/authApi';

interface User {
    email: string;
    name?: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    loginWithOAuth: (
        token: string,
        email: string | null
    ) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: Readonly<AuthProviderProps>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
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

    const login = async (
        email: string,
        password: string
    ): Promise<void> => {
        const data = await authApi.login({
            email,
            password,
        });

        const userData: User =
            data.user ?? {
                email,
            };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<void> => {
        const data = await authApi.register({
            name,
            email,
            password,
        });

        const userData: User =
            data.user ?? {
                name,
                email,
            };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const loginWithOAuth = (
        token: string,
        email: string | null
    ): void => {
        const userData: User = {
            email: email ?? '',
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
    };

    const value = useMemo<AuthContextType>(
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

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}