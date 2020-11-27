import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form_footer from './Form__footer';
import axios from './axios';
import '../styles/ResetPassword.css';

const ResetPassword = ({ match }) => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");

    const token = match.params.id;

    const sendResetPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                url: '/users/resetPassword/:token',
                data: {
                    token, 
                    password,
                    passwordConfirm
                },
                withCredentials: true
            });

            if(res.data.status === 'success') {
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);
            }

        } catch(err) {
            if(err.response.data.message.split(' ')[4] === undefined) {
                setError(err.response.data.message);
            } else {
                setError(err.response.data.message.split(' ')[4]);
            }  
        }
    };

    return (
        <div className="resetPassword__container">
            <Link to="/" className="resetPassword__container_logo">WORKUP</Link>
            <div className="resetPassword__wrapper">
                <form className="resetPassword__form" onSubmit={sendResetPassword}>
                    <h3>新しいパスワードを作成</h3>
                    {
                        error && (<p className="resetPassword__error">*{error}</p>)
                    }
                    <div className="resetPassword__form_wrapper">
                        <label htmlFor="password"><i className="fas fa-unlock-alt"></i>&nbsp;パスワードを入力</label>
                        <input type="password" id="password" placeholder="パスワードを入力" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="resetPassword__form_wrapper">
                        <label htmlFor="passwordConfirm"><i className="fas fa-unlock-alt"></i>&nbsp;確認用パスワード</label>
                        <input type="password" id="passwordConfirm" placeholder="確認用のパスワードを入力" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
                    </div>
                    <button type="submit" className="resetPassword__form_button">パスワードを作成</button>
                </form>
            </div>
            <Form_footer />
        </div>
    )
};

export default ResetPassword;
