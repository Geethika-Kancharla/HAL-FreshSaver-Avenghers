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

    const currentUser = firebase.isLoggedIn;

    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/login"></Navigate>;
    }

    return (
        <Routes>
            <Route index element={<Home />} />
            <Route index path="/register" element={<Register />} />
            <Route path="/details" element={<RequireAuth><Details /></RequireAuth>} />
            <Route index path="/display" element={<RequireAuth><Display /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;