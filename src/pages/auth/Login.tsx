import React, { useContext, useState } from 'react';
import '@/css/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import backwebm from '@/assets/backwebm.webm';
import { AuthService } from '@/module/auth/AuthService';
import { LoginModel } from '@/module/auth/LoginModel';
import { toast } from 'sonner';
import { setSessionAuth } from '@/utils/storage';
import { AppContext } from '@/contexts/app.context';
import { useTasks } from '@/contexts/tasks.context';
import LoginWithGoogle from './LoginWithGoogle';


const Login = () => {
    const { setIsAuthenticated } = useContext(AppContext);
    const { setTasksFromLogin } = useTasks(); // Moved to top level
    const navigate = useNavigate();
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );

    const handleSubmit = ( event: React.FormEvent ) => {
        event.preventDefault();
        const loginData: LoginModel = { email, password };
        try {
            AuthService.login( loginData ).then( ( response ) => {
                if ( response.success ) {
                    console.log( 'Login response:', JSON.stringify( response ) );
                    const { user} = response;
                    if ( user ) {
                        const { uid, email } = user;
                        setTasksFromLogin((user as any).tasks ?? []); 
                        setSessionAuth(uid , email || '' );
                        setIsAuthenticated( true );
                        toast.success( 'Login successful!' );
                    }
                    else{
                        toast.error( 'User data is missing in the response' );
                    }
                    navigate("/");
                } else {
                    toast.error( 'Login failed ');
                }
            } );
        } catch ( error ) {
            toast.error( 'An error occurred during login' );
        }
    };

    return (

        <div className="auth-container">
            <video autoPlay muted loop playsInline className='auth-video'>
                <source src={backwebm} type="video/webm" />
            </video>

            <form onSubmit={ handleSubmit } className="auth-form">
                <h2>Task Mind</h2>
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
                <LoginWithGoogle />
                <button type="submit" className="auth-button">Login</button>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;