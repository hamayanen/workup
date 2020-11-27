import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="notfound__component">
            404 Not Found Page - <Link to='/' className="notfound__link">Go home</Link>
        </div>
    )    
};

export default NotFoundPage;