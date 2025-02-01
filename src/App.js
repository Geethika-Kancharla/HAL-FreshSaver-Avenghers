import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { useFirebase } from './context/Firebase';
import { Navigate } from 'react-router-dom';
import Details from './pages/Details';
import Display from './pages/Display';

function App() {
    const firebase = useFirebase();

    const isAuthenticated = () => {
        return firebase.isLoggedIn || localStorage.getItem('user') !== null;
    }

    const RequireAuth = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    }

    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details" element={<RequireAuth><Details /></RequireAuth>} />
            <Route path="/display" element={<RequireAuth><Display /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;