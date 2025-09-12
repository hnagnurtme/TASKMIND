import React, { useState } from 'react';
import './auth.css'; // Importing shared CSS for auth pages
import { Link } from 'react-router-dom';
import backwebm from '@/assets/backwebm.webm';
const Login = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );

    const handleSubmit = ( event: React.FormEvent ) => {
        event.preventDefault();
        console.log( 'Email:', email, 'Password:', password );
    };

    return (

        <div className="auth-container">
            <video autoPlay muted loop playsInline className='auth-video'>
                <source src={backwebm} type="video/webm" />
            </video>

            <form onSubmit={ handleSubmit } className="auth-form">
                <h2>Login</h2>
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
                <button type="submit" className="auth-button">Login</button>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;