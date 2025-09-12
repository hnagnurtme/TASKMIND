
import { AppContext, AppContextType } from '@/contexts/app.context';
import LayoutMain from '@/layouts/LayoutMain';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Home from '@/pages/home';
import { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

export default function useRoutesElements () {
    const { isAuthenticated } = useContext<AppContextType>( AppContext );
    const ProtectedRoute = ( { children }: { children: React.ReactNode } ) => {
        return isAuthenticated ? children : <Navigate to='/login' />;
    };
    const routeElements = useRoutes( [
        {
            path: '/taskmind',
            element:
                <ProtectedRoute>
                     <LayoutMain children={ <Home /> } />
                </ProtectedRoute>
        },
        {
            path: '/login',
            element: isAuthenticated ? <Navigate to='/taskmind' /> : <Login />,
        },
        {
            path: '/register',
            element: isAuthenticated ? <Navigate to='/taskmind' /> : <Register />,
        },
        { path: '*', element: <h1>404</h1> },

    ] );

    return routeElements;
}
