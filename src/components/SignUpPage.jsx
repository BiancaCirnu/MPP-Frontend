import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function SignUpPage() {
    const navigate = useNavigate();
    
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [PasswordConfirmation, setPasswordConfirmation] = useState("");

    const handleSignUp = (e) => {
        if(PasswordConfirmation == Password)
            navigate("/concerts");
    }
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{ width: '400px' }}>
                <h2 className="mb-4 text-center">Log in</h2>
                <form onSubmit={handleSignUp}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                        type="text"
                        placeholder="Enter username"
                        className="form-control"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Create a password</label>
                        <input
                        type="password"
                        placeholder="Enter password"
                        className="form-control"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm password</label>
                        <input
                        type="password"
                        placeholder="Confirm password"
                        className="form-control"
                        required
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage
