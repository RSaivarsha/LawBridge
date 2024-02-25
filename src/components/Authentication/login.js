import React, { useState } from 'react';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import 'bootswatch/dist/darkly/bootstrap.min.css'; // Import Bootswatch dark theme

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook to navigate between routes

    const signIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in');
            let role = '';
            if (email.endsWith('.edu')) {
                role = 'student';
            } else if (email.endsWith('admin.com')) {
                role = 'admin';
            } else {
                role = 'customer';
            }
            
            // Log the user's role
            console.log('User role:', role);
            
            // Navigate to home page with role as a query parameter
            navigate('/home', { state: { role: role } });
        } catch (error) {
            setError(error.message);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert('Invalid email or password. Please try again.');
            } else if (error.code === 400) {
                alert('Bad Request. Please check your email and password and try again.');
            }
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-6">
                <h2 className="text-center">Login</h2>
                <form onSubmit={signIn}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    <p className="text-center mt-3">Create a new account? <Link to="/">Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
