import React, { useState, useEffect } from 'react'
import { useFirebase } from '../context/Firebase';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

    const firebase = useFirebase();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();

    const [phno, setPhno] = useState();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await firebase.addUser(email, password, name, phno);
        console.log("Successfull", result);
    }

    useEffect(() => {
        if (firebase.isLoggedIn) {
            console.log(firebase);
            navigate("/");
        }
    }, [firebase, navigate])


    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 to-blue-300 w-screen'>
            <form onSubmit={handleSubmit} className='flex justify-center items-center rounded-md shadow-lg'>
                <div className='flex flex-col p-14 justify-center items-center space-y-5 rounded-md shadow-3xl bg-white'>
                    <h2 className='text-3xl'>Sign Up </h2>
                    <input type='text' placeholder='Enter the name' value={name} onChange={(e) => setName(e.target.value)} className='border border-slate-800 rounded-lg w-96 p-2 placeholder-black'></input>


                    <input type='tel' placeholder='Enter the phone number' value={phno} onChange={(e) => setPhno(e.target.value)} className='border border-slate-800 rounded-lg w-96 p-2 placeholder-black'></input>

                    <input type='email' placeholder='Enter the email' value={email} onChange={(e) => setEmail(e.target.value)} className='border border-slate-800 rounded-lg w-96 p-2 placeholder-black'></input>

                    <input type='password' placeholder='Enter the password' value={password} onChange={(e) => setPassword(e.target.value)} className='border border-slate-800 rounded-lg w-96 p-2 placeholder-black'></input>

                    <button className='bg-gradient-to-br from-green-300 to-blue-300 p-2 rounded-md ' type='submit'>Sign Up</button>
                    <p>Already have an account <Link to="/" className="text-blue-500">Sign In</Link></p>

                </div>
            </form>
        </div>

    )
}

export default Register;