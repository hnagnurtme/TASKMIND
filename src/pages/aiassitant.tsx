import TaskProgress from "@/components/TaskProgress";
import { useTasks } from '@/contexts/tasks.context';
import { useState, useEffect } from 'react';
import "@/css/home.css";

import { Assistant } from "@/components/Assitant";

export default function AI () {
    const { tasks } = useTasks();
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () => {
        const timer = setTimeout( () => setIsLoading( false ), 1000 );
        return () => clearTimeout( timer );
    }, [] );

    const completionPercent = tasks.length
        ? ( tasks.filter( ( task ) => task.completed ).length / tasks.length ) * 100
        : 0;

    if ( isLoading ) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div className="main-content">
            <TaskProgress completionPercent={ completionPercent } />
            <Assistant tasks={tasks} />
        </div>
    );
}