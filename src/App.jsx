import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Landing from './features/landing/pages/Landing.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import React from "react";
import {OAuth2Callback} from "./features/auth/pages/OAuth2Callback";
import HabitTracker from "./features/dashboard/pages/HabitTracker";
import './App.css';
import NewHabit from "./features/custom_habit/pages/NewHabit";
import HabitDetail from "./features/custom_habit/pages/HabitDetail";
import AppLayout from "./features/dashboard/pages/AppLayout";
import './styles/global.css';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/oauth2/callback" element={<OAuth2Callback/>}/>

                    {/* Protected */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/habit-tracker" element={<HabitTracker />} />
                        <Route path="/new-habit" element={<NewHabit />} />
                        <Route path="/habit-detail" element={<HabitDetail />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace/>}/>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
