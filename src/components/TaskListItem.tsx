import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskModal from './AddTask'; // Updated import to TaskModal
import TaskStats from './TaskStats'; // Import the extracted TaskStats component
import { useTasks } from '@/contexts/tasks.context';
import { Task } from '@/interface/task';
import { calculateTaskStats } from '@/utils/taskStats'; // Import the utility function
import "@/css/TaskListItem.css";

// ----------------------------
// TaskList Component chính
// ----------------------------
const TaskList: React.FC = () => {
    const {
        filteredTasks,
        addTask,
        toggleComplete,
        editTask,
        deleteTask
    } = useTasks();

    const [ showModal, setShowModal ] = useState( false );
    const [ taskToEdit, setTaskToEdit ] = useState<Task | null>( null );

    const handleOpenAddModal = () => {
        setTaskToEdit( null );
        setShowModal( true );
    };

    const handleOpenEditModal = ( task: any ) => {
        setTaskToEdit( task );
        setShowModal( true );
    };

    return (
        <div className="task-list">
            <TasksContainer
                tasks={ filteredTasks }
                onToggleComplete={ toggleComplete }
                onEdit={ handleOpenEditModal }
                onDelete={ deleteTask }
                onOpenAddModal={ handleOpenAddModal }
            />

            <TaskModal
                isOpen={ showModal }
                onClose={ () => setShowModal( false ) }
                onSubmit={ ( task ) => {
                    if ( taskToEdit ) {
                        editTask( {
                            id: taskToEdit.id,
                            completed: taskToEdit.completed,
                            completedAt: taskToEdit.completedAt,
                            ...task
                        } );
                    } else {
                        addTask( task );
                    }
                } }
                taskToEdit={ taskToEdit }
            />
        </div>
    );
};

export default TaskList;

// ----------------------------
// Tasks Container
// ----------------------------
interface TasksContainerProps {
    tasks: any[];
    onToggleComplete: ( id: string ) => void;
    onEdit: ( task: any ) => void;
    onDelete: ( id: string ) => void;
    onOpenAddModal: () => void;
}

function TasksContainer ( {
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onOpenAddModal
}: TasksContainerProps ) {
    const [ loadingTaskId, setLoadingTaskId ] = useState<string | null>( null );

    const sortedTasks = [ ...tasks ].sort( ( a, b ) => {
        if ( a.completed !== b.completed ) {
            return a.completed ? 1 : -1; // incomplete first
        }
        return new Date( a.deadline ).getTime() - new Date( b.deadline ).getTime();
    } );

    const stats = calculateTaskStats(tasks);

    const handleToggleComplete = ( id: string ) => {
        setLoadingTaskId( id );
        onToggleComplete( id );
        setTimeout( () => setLoadingTaskId( null ), 1000 ); // Simulate loading state
    };

    return (
        <>
            <TaskStats stats={ stats } />

            { tasks.length > 0 ? (
                <div className="task-items">
                    { sortedTasks.map( task => (
                        <TaskItem
                            key={ task.id }
                            task={ task }
                            onToggleComplete={ () => handleToggleComplete( task.id ) }
                            onEdit={ () => onEdit( task ) }
                            onDelete={ onDelete }
                            loading={ loadingTaskId === task.id } // Pass loading state
                        />
                    ) ) }
                </div>
            ) : (
                <div className="task-items">
                    <button className="empty-add-btn" onClick={ onOpenAddModal }>
                        ➕ Thêm task đầu tiên
                    </button>
                </div>
            ) }
        </>
    );
}
