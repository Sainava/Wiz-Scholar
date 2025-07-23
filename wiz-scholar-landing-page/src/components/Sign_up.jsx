import React, { useState } from "react";
import {getAuth, createUserWithEmailAndPassword,  GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase"; 
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const SignupPage = () => {
        const navigate = useNavigate();

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");

     const handleSubmit = () => {
        createUserWithEmailAndPassword(auth, email, password).then(value => alert("User created successfully!"))
        setEmail("");
        setPassword("");
     }

     const handlegooglesignIn = () => {
  signInWithPopup(auth,provider)
}

const goToDashboard = () => {
        navigate('/Dashboard'); // Assuming you have a dashboard route
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Create Account
                        </h2>
                        <p className="text-gray-600 mt-2">Join us and start your journey today</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                        </div>

                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Sign Up
                        </button>

                        {/* Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button 
                            onClick={async () => {
                                try {
                                    await signInWithPopup(auth,provider);
                                    goToDashboard();
                                } catch (error) {
                                    alert("Google sign-in failed.");
                                }
                            }}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="text-sm">Google</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span className="text-sm">Facebook</span>
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{' '}
                            <a href="/signin" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SignupPage;