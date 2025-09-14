
import { useState, useEffect } from 'react';
import "@/css/home.css";
import ValueComplexityMatrix from "@/components/DashBoard";

export default function DashBoard () {
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