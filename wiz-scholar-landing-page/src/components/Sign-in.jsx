import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { app } from "../firebase"; 
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Star, Wand2 } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignInPage = () => {
    const navigate = useNavigate();
    const { sortingCompleted, user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const goToDashboard = () => {
        navigate('/Dashboard');
    }

    const goToSortingHat = () => {
        navigate('/sorting-hat');
    }

    const handleSuccessfulLogin = () => {
        console.log('=== LOGIN DEBUG ===');
        console.log('handleSuccessfulLogin called');
        console.log('Current sortingCompleted:', sortingCompleted);
        console.log('Current user:', user);
        
        // For better UX, wait a moment for auth context to load if needed
        setTimeout(() => {
            console.log('After timeout - sortingCompleted:', sortingCompleted);
            
            if (sortingCompleted === null) {
                // Still loading user data - default to dashboard for existing users
                console.log('🔄 Sorting status still loading, going to dashboard');
                goToDashboard();
            } else if (sortingCompleted === true) {
                // User has completed sorting, go to tools page
                console.log('✅ Sorting completed, going to dashboard');
                goToDashboard();
            } else {
                // User hasn't completed sorting, send to sorting ceremony
                console.log('❌ Sorting not completed, going to sorting hat');
                goToSortingHat();
            }
            console.log('=== LOGIN DEBUG END ===');
        }, 1000); // Increased delay to allow context to update
    }

    const handleEmailSignIn = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail("");
            setPassword("");
            handleSuccessfulLogin();
        } catch (error) {
            setError("Sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const isNewUser = result.additionalUserInfo?.isNewUser;
            
            if (isNewUser) {
                // New user signing in with Google - go to sorting ceremony
                goToSortingHat();
            } else {
                // Existing user - check sorting completion status
                handleSuccessfulLogin();
            }
        } catch (error) {
            setError("Google sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first");
            return;
        }

        setLoading(true);
        setError("");
        setResetEmailSent(false);
        
        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError("");
        } catch (error) {
            setError("Failed to send password reset email: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4 relative overflow-hidden">
            {/* Magical Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-gradient-card border border-border rounded-xl shadow-magical backdrop-blur-sm p-8 hover:shadow-mystical transition-all duration-500">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-magical">
                            <Wand2 className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-3xl font-magical font-bold text-foreground mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-muted-foreground font-mystical">
                            Please sign in to your magical account
                        </p>
                        <div className="flex justify-center mt-4 space-x-2">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <Star className="w-3 h-3 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-destructive text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Success Message for Password Reset */}
                    {resetEmailSent && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-green-400 text-sm font-medium">
                                Password reset email sent! Please check your inbox and follow the instructions to reset your password.
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-foreground mb-2 font-mystical">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 text-foreground placeholder-muted-foreground font-serif"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-foreground font-mystical">
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={loading}
                                    className="text-sm text-primary hover:text-primary-glow transition-colors duration-300 font-mystical disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password" 
                                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 text-foreground placeholder-muted-foreground font-serif"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="remember-me" 
                                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                                disabled={loading}
                            />
                            <label htmlFor="remember-me" className="ml-3 text-sm text-muted-foreground font-mystical">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button 
                            onClick={handleEmailSignIn}
                            disabled={loading}
                            className="w-full bg-gradient-primary hover:shadow-magical text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-card hover:shadow-mystical disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-magical"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-3 text-muted-foreground font-mystical">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <div className="mt-6">
                            <button 
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all duration-300 transform hover:scale-105 shadow-card disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                            >
                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="text-sm font-mystical text-foreground group-hover:text-primary transition-colors duration-300">
                                    Continue with Google
                                </span>
                            </button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-sm text-muted-foreground mt-6 font-mystical">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-semibold text-primary hover:text-primary-glow transition-colors duration-300">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>

                {/* Floating magical elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8">
                    <Sparkles className="w-full h-full text-primary animate-bounce" style={{ animationDelay: '2s' }} />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6">
                    <Star className="w-full h-full text-accent animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
