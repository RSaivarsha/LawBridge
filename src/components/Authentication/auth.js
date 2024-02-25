import React, { useState } from 'react';
import { auth, db } from '../../firebase/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import 'bootswatch/dist/darkly/bootstrap.min.css'; // Import Bootswatch dark theme


import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const hasUpperCase = (str) => /[A-Z]/.test(str);
    const hasLowerCase = (str) => /[a-z]/.test(str);
    const hasNumber = (str) => /[0-9]/.test(str);


    
    const signIn = async (e) => {
        e.preventDefault();
    
        const isEmailValid = /\S+@\S+\.\S+/.test(email);
        if (!isEmailValid) {
            alert('Invalid email format.');
            return;
        }
    
        const isPasswordValid = password.length >= 8 && hasUpperCase(password) && hasLowerCase(password) && hasNumber(password);
        if (!isPasswordValid) {
            alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Add user details to Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                email: user.email,
                role: 'Customer' // Default role
            });
    
            navigate("/login");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Email address is already in use.');
            } else {
                alert('An error occurred. Please try again later.');
                console.error(error);
            }
        }
    }
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-6">
                <h2 className="text-center mb-4">Sign Up</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your email"
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={signIn} type="submit" className="btn btn-primary w-100">
                        Sign Up
                    </button>
                    
                    <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Auth;
