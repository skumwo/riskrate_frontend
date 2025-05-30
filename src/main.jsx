import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import { UserProvider } from "./context/UserContext.jsx"; // 👈 Добавили
import UserFilesPage from './pages/UserFilesPage.jsx';
import GroupedActionsPage from './pages/GroupedActionsPage.jsx';
import RegisterPage from "./pages/RegisterPage.jsx";
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <UserProvider>
            <Header />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/my-files" element={<UserFilesPage />} />
                <Route path="/grouped-actions" element={<GroupedActionsPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={8000} />
        </UserProvider>
    </BrowserRouter>
);







