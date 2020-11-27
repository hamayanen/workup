import React from 'react';
import { useLocation } from 'react-router-dom'
import Home_nav from './Home_nav';
import Home_main from './Home_main';
import Home_footer from './Home_footer';
import '../styles/Home.css';


const Home = () => {
    const location = useLocation();

    if(location.pathname !== '/jobs') {
        sessionStorage.removeItem('currentPage');
        sessionStorage.removeItem('searchValue');
    };

    return (
        <div className="app">
            <Home_nav />
            <Home_main />
            <Home_footer />
        </div>
    )
}

export default Home;

