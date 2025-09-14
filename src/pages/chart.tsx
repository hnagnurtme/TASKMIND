import { useState, useEffect } from 'react';
import "@/css/home.css";
import ChartItem from "@/components/ChartItem";

export default function Chart () {
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
            < ChartItem />
        </div>
    );
}