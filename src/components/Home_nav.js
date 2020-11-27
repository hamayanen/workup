import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import '../styles/Home_nav.css';

const Home_nav = () => {

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        isOpen && menuRef.current.focus();
    }, [isOpen]);

    const sendLogout = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                url: 'http://127.0.0.1:3000/api/v1/users/logout',
                withCredentials: true
            });

            if(res. data.status === 'success') {
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }

        } catch (err) {
            console.log(err);
        };
    }

    return (
        <div>
            <nav className="nav__main">
                <div className="nav__logo">
                    <a href="" className="nav__link nav__link_logo">WORKUP</a>
                </div>
                <div className="nav__search">
                    <a href="" className="nav__link">求人検索</a>
                </div>
                {
                    !document.cookie.split(';').some((item) => item.includes('jwt')) ? (
                        <div className="nav__account">
                            <Link to='/login' className="nav__link nav__link_account">ログイン</Link>
                            <Link to='/signup' className="nav__link nav__link_account">アカウント作成</Link>
                            <span>|</span>
                            <a href="" className="nav__link nav__link_account">求人広告掲載</a>
                        </div>
                    ) : 
                    (
                        <div className="nav__account">
                            <Link to='/meeting' className="nav__link nav__link_account">面接する</Link>
                            <div 
                                onClick={() => setIsOpen(isOpen ? false: true)} 
                                className="nav__link nav__link_dropdownBar"
                            >
                                ユーザー情報&nbsp;▼
                            </div>
                            { isOpen &&
                                <ul 
                                    onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                                    ref={menuRef}
                                    tabIndex={1}
                                    className={"nav__link_dropdown"}
                                >
                                    <Link to='/updatePassword' className="nav__link nav__link_dropdownItem"><li>パスワード変更</li></Link>
                                    <li className="nav__link nav__link_dropdownItem" onClick={sendLogout}>ログアウト</li>
                                </ul>
                            }
                            &nbsp;
                            <span>|</span>
                            <a href="" className="nav__link nav__link_account">求人広告掲載</a>
                        </div>
                    )
                }
                
            </nav>
        </div>
    )
};

export default Home_nav;