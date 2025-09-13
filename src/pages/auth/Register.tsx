import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import backwebm from '@/assets/backwebm.webm';
import { toast } from 'sonner';
import { AuthService } from '@/module/auth/AuthService';
import { RegisterModel } from '@/module/auth/RegisterModel';
import LoginWithGoogle from './LoginWithGoogle';
const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );

    const handleSubmit = async ( event: React.FormEvent ) => {
        event.preventDefault();
        if ( password !== confirmPassword ) {
            toast.error( 'Passwords do not match!' );
            return;
        }
        const registerData: RegisterModel = { email, password, name };
        console.log(registerData);
        try {
            const response = await AuthService.register( registerData );
            if ( response.success ) {
                toast.success( 'Registration successful!' );
                navigate("/login");

            } else {
                toast.error( 'Registration failed ');
            }
        } catch ( error ) {
            toast.error( 'An error occurred during registration' );
        }

    };

    return (
        <div className="auth-container">
            <video autoPlay muted loop playsInline className="auth-video">
                <source src={ backwebm } type="video/webm" />
            </video>

            <form onSubmit={ handleSubmit } className="auth-form">
                <h2>Task Mind</h2>

                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={ name }
                    onChange={ ( e ) => setName( e.target.value ) }
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={ email }
                    onChange={ ( e ) => setEmail( e.target.value ) }
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={ password }
                    onChange={ ( e ) => setPassword( e.target.value ) }
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={ confirmPassword }
                    onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                    required
                />
                <LoginWithGoogle />
                <button type="submit" className="auth-button">Register</button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );

};

export default Register;