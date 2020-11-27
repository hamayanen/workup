import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Signup from '../components/Signup'; 
import PasswordChange from '../components/PasswordChange';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import Jobs from '../components/Jobs';
import Meeting from '../components/Meeting';
import NotFoundPage from '../components/NotFoundPage';

const AppRouter = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/' component={Home} exact={true} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/updatePassword' component={PasswordChange} />
            <Route path='/forgotPassword' component={ForgotPassword} />
            <Route path='/resetPassword/:id' component={ResetPassword} />
            <Route path='/jobs' component={Jobs} />
            <Route path='/meeting' component={Meeting} />
            <Route component={NotFoundPage} />
        </Switch>
    </BrowserRouter>
);

export default AppRouter;