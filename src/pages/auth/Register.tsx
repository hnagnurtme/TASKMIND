import React, { useState } from 'react';
import './auth.css';
import { Link } from 'react-router-dom';
import backwebm from '@/assets/backwebm.webm';
const Register = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );

    const handleSubmit = ( event: React.FormEvent ) => {
        event.preventDefault();
        if ( password !== confirmPassword ) {
            alert( 'Passwords do not match!' );
            return;
        }
        // Handle registration logic here, e.g., call an authentication API
        console.log( 'Email:', email, 'Password:', password );
    };

    return (
        <div className="auth-container">
            <video autoPlay muted loop playsInline className='auth-video'>
                <source src={backwebm} type="video/webm" />
            </video>

            <form onSubmit={ handleSubmit } className="auth-form">
                <h2>Register</h2>
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
                <button type="submit" className="auth-button">Register</button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;