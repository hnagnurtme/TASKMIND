import { AppContext, AppContextType } from '@/contexts/app.context';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '../assets/logo.webp';
const TopBar = () => {
    return (
        <div className='topbar'>
            <div className='topbar-left'>
                <Logo />
            </div>
            <div className='topbar-right'>
                <UserAdmin />
            </div>
        </div>
    );
};

function Logo () {
    return (
        <Link to='/' className='logo'>
            <img src={ logo } alt='logo' className='logo-image' />
        </Link>
    );
}

function UserAdmin () {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext<AppContextType>( AppContext );
    const logout = () => {
        localStorage.clear();
        setIsAuthenticated( false );
        navigate( '/login' );
        toast.success( 'Logout successfully!' );
    };
    return (
            <div className='dropdown-menu'>
                <button className="logout-button" onClick={ logout }>
                    Logout
                </button>
            </div>
    );
}

export default TopBar;
