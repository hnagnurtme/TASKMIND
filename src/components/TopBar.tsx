import { AppContext, AppContextType } from '@/contexts/app.context';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, Plus, User, LogOut } from 'lucide-react';
import AddTask from './AddTask';
import Modal from 'react-modal';

const TopBar = () => {
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ showAddTaskModal, setShowAddTaskModal ] = useState( false );

    const handleSearch = ( e: React.FormEvent ) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log( 'Searching for:', searchTerm );
    };

    return (
        <div className='topbar'>
            <div className='topbar-left'>
                <Logo />
                <SearchBar
                    searchTerm={ searchTerm }
                    setSearchTerm={ setSearchTerm }
                    onSearch={ handleSearch }
                />
            </div>
            <div className='topbar-right'>
                <AddTaskButton onClick={ () => setShowAddTaskModal( true ) } />
                <UserMenu />
            </div>
            <Modal
                isOpen={ showAddTaskModal }
                onRequestClose={ () => setShowAddTaskModal( false ) }
                contentLabel="Add Task Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <AddTask
                    onClose={ () => setShowAddTaskModal( false ) }
                    isOpen={ showAddTaskModal }
                    onAddTask={ () => {
                        setShowAddTaskModal( false );
                    } }
                />
            </Modal>
        </div>
    );
};

function Logo () {
    return (
        <Link to='/' className='logo'>
            <div className='logo-content'>
                <div className='logo-icon'>⚡</div>
                <span className='logo-text'>TASK MIND</span>
            </div>
        </Link>
    );
}

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: ( term: string ) => void;
    onSearch: ( e: React.FormEvent ) => void;
}

function SearchBar ( { searchTerm, setSearchTerm, onSearch }: SearchBarProps ) {
    return (
        <form className='search-form' onSubmit={ onSearch }>
            <div className='search-container'>
                <Search className='search-icon' size={ 20 } />
                <input
                    type='text'
                    placeholder='Tìm task theo tên...'
                    className='search-input'
                    value={ searchTerm }
                    onChange={ ( e ) => setSearchTerm( e.target.value ) }
                />
            </div>
        </form>
    );
}

interface AddTaskButtonProps {
    onClick: () => void;
}

function AddTaskButton ( { onClick }: AddTaskButtonProps ) {
    return (
        <button className='add-task-button' onClick={ onClick }>
            <Plus size={ 20 } />
            <span>Add Task</span>
        </button>
    );
}

function UserMenu () {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext<AppContextType>( AppContext );
    const [ isMenuOpen, setIsMenuOpen ] = useState( false );

    // Mock user data - replace with actual user data from context
    const user = {
        name: 'Nguyen Van A',
        email: 'nguyenvana@example.com'
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated( false );
        navigate( '/login' );
        toast.success( 'Logout successfully!' );
        setIsMenuOpen( false );
    };

    const toggleMenu = () => {
        setIsMenuOpen( !isMenuOpen );
    };

    return (
        <div className='user-menu'>
            <button className='user-menu-trigger' onClick={ toggleMenu }>
                <User size={ 20 } />
                <span className='user-name'>{ user.name }</span>
            </button>

            { isMenuOpen && (
                <>
                    <div className='menu-overlay' onClick={ () => setIsMenuOpen( false ) } />
                    <div className='dropdown-menu'>
                        <div className='user-info'>
                            <div className='user-avatar'>
                                <User size={ 24 } />
                            </div>
                            <div className='user-details'>
                                <div className='user-name-full'>{ user.name }</div>
                                <div className='user-email'>{ user.email }</div>
                            </div>
                        </div>

                        <div className='menu-divider' />

                        <button className='menu-item' onClick={ () => setIsMenuOpen( false ) }>
                            <User size={ 18 } />
                            <span>Profile</span>
                        </button>

                        <button className='menu-item logout-item' onClick={ logout }>
                            <LogOut size={ 18 } />
                            <span>Logout</span>
                        </button>
                    </div>
                </>
            ) }
        </div>
    );
}

export default TopBar;