
import { AppContext, AppContextType } from '@/contexts/app.context';
import LayoutDashboard from '@/layouts/LayoutDashboard';
import LayoutMain from '@/layouts/LayoutMain';
import AI from '@/pages/aiassitant';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Calendar from '@/pages/calendar';
import Chart from '@/pages/chart';
import DashBoard from '@/pages/dashboard';
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
            path: '/',
            element:
                <ProtectedRoute>
                     <LayoutMain children={ <Home /> } />
                </ProtectedRoute>
        },
        {
            path: '/login',
            element: isAuthenticated ? <Navigate to='/' /> : <Login />,
        },
        {
            path: '/register',
            element: isAuthenticated ? <Navigate to='/login' /> : <Register />,
        },
        {
            path: '/chart',
            element:
                <ProtectedRoute>
                     <LayoutDashboard children={ <Chart /> } />
                </ProtectedRoute>

        },
        {
            path: '/calendar',
            element:
                <ProtectedRoute>
                     <LayoutDashboard children={ <Calendar /> } />
                </ProtectedRoute>

        },
        {
            path: '/taskmind',
            element:
                <ProtectedRoute>
                     <LayoutDashboard children={ <DashBoard /> } />
                </ProtectedRoute>

        },
        {
            path: '/ai',
            element:
                <ProtectedRoute>
                     <LayoutDashboard children={ <AI /> } />
                </ProtectedRoute>

        },
        { path: '*', element: <h1>404</h1> },

    ] );

    return routeElements;
}
