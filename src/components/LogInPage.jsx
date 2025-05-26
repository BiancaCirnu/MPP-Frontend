import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogInPage() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogIn = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Send login credentials to backend
            const response = await axios.post(import.meta.env.VITE_SERVER_URL+'/login', {
                username: username,
                password: password
            });

            // Our updated backend returns { message: "Login successful", user: {...} }
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Add this if you implement JWT tokens later
            // if (response.data.token) {
            //     localStorage.setItem('token', response.data.token);
            // }

            // Redirect to home page or dashboard
            navigate('/');
            
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.error || 
                "Unable to log in. Please check your credentials and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{ width: '400px' }}>
                <h2 className="mb-4 text-center">Log in</h2>
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogIn}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="form-control"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="form-control"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success w-100 mb-3"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Enter Account'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-primary w-100" 
                        onClick={goToSignUp}
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LogInPage;