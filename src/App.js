import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routes/AppRouter'; 
import 'normalize.css/normalize.css';
import './styles/App.css';


ReactDOM.render (
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
    document.getElementById('app')
);