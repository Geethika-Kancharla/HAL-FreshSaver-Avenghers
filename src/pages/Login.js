import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const firebase = useFirebase();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await firebase.signinUserWithEmailAndPassword(email, password);
            // User will be automatically stored in localStorage through Firebase context
            console.log("Successful", result);
            console.log("Logged In");
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const handlePasswordReset = () => {
        const email = prompt("Please enter your email");
        if (email) {
            firebase.sendPasswordResetEmail(email);
            alert("Password reset email sent! Please check your inbox.");
        }
    }

    useEffect(() => {
        // Check localStorage for existing user
        const savedUser = localStorage.getItem('user');
        if (savedUser || firebase.isLoggedIn) {
            navigate("/");
        }
    }, [firebase, navigate])

    return (
        <div className=' min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 to-blue-300 w-screen'>
            <div className="login-container ">
                <h2 className='font-bold mb-3 text-lg'>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" id='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="forgot-password" onClick={handlePasswordReset}>
                        <span className='text-sm'>Forgot your password?</span>
                    </div>
                    <button type="submit" className='bg-gradient-to-br from-green-300 to-blue-300 p-2'>Sign In</button>
                </form>
                <div className="signup-option">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
                <div className="google-login " onClick={firebase.signinWithGoogle}>
                    <img src="https://www.google.com/favicon.ico" alt="Google Logo" />
                    <span>Continue with Google</span>
                </div>
            </div>
        </div>
    );
};

export default Login