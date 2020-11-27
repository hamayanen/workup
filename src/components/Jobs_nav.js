import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Jobs_nav.css';

const Jobs_nav = () => {
    return (
        <div>
            <nav className="nav__main">
                <div className="nav__logo_job">
                    <Link to='/' className="nav__link nav__link_logo">WORKUP</Link>
                </div>
                <div className="nav__search">
                </div>
                <div className="nav__account_job">
                    <Link to='/meeting/:id' className="nav__link nav__link_account"><i className="fas fa-video"></i>面接</Link>
                    <Link to='/resume/profile/:id' className="nav__link nav__link_account"><i className="fas fa-user-alt"></i>プロフィール・履歴書</Link>
                    <span>|</span>
                    <a href="" className="nav__link nav__link_account">求人広告掲載</a>
                </div>
            </nav>
        </div>
    )
};

export default Jobs_nav;