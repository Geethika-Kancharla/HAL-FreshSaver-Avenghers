import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';
import { Home, LogOut, Eye } from 'lucide-react';

const DetailNavbar = () => {
    const firebase = useFirebase();
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 relative
           bg-white `}>
            <div className="max-w-7xl mx-auto">
                <nav className="flex justify-between items-center">
                   
                    <Link 
                        to="/" 
                        className="text-xl font-semibold flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
                    >
                        <Home className="h-5 w-5" />
                        <span>FreshSaver</span>
                    </Link>

                   
                    <div className="flex items-center gap-8">
                        <Link 
                            to="/display" 
                            className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
                        >
                            <Eye className="h-5 w-5" />
                            <span>View Items</span>
                        </Link>
                        <button
                            onClick={firebase.handleLogout}
                            className="flex items-center gap-2 text-gray-800 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
        </header>
    );
};

export default DetailNavbar; 