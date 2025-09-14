import TaskProgress from "@/components/TaskProgress";
import { useTasks } from '@/contexts/tasks.context';
import { useState, useEffect } from 'react';
import "@/css/home.css";
import CalendarView from "@/components/Calendar";
import ValueComplexityMatrix from "@/components/DashBoard";

export default function DashBoard () {
    const { tasks } = useTasks();
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () => {
        const timer = setTimeout( () => setIsLoading( false ), 1000 );
        return () => clearTimeout( timer );
    }, [] );

    if ( isLoading ) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div className="main-content">
            < ValueComplexityMatrix />
        </div>
    );
}