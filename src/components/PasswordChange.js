import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form_footer from './Form__footer';
import '../styles/PasswordChange.css';
import axios from './axios';

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [error, setError] = useState("");

    const sendNewPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                url: '/users/updatePassword',
                data: {
                    currentPassword,
                    newPassword,
                    newPasswordConfirm
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
        };

        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
    }

    return (
        <div className="passwordChange__container">
            <Link to="/" className="passwordChange__container_logo">WORKUP</Link>
            <div className="passwordChange__wrapper">
                <form className="passwordChange__form">
                    <h3>パスワード変更</h3>
                    {
                        error && (<p className="passwordChange__error">*{error}</p>)
                    }
                    <div className="passwordChange__form_wrapper">
                        <label htmlFor="currentPassword"><i className="fas fa-unlock-alt"></i>&nbsp;現在のパスワード</label>
                        <input type="text" id="currentPassword" placeholder="現在のパスワードを入力" onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} />
                    </div>
                    <div className="passwordChange__form_wrapper">
                        <label htmlFor="newPassword"><i className="fas fa-unlock-alt"></i>&nbsp;新しいパスワード</label>
                        <input type="password" id="newPassword" placeholder="新しいパスワードを入力" onChange={e => setNewPassword(e.target.value)} value={newPassword} />
                    </div>
                    <div className="passwordChange__form_wrapper">
                        <label htmlFor="newPasswordConfirm"><i className="fas fa-unlock-alt"></i>&nbsp;新しいパスワード確認用</label>
                        <input type="password" id="newPasswordConfirm" placeholder="上記と同じものを入力" onChange={e => setNewPasswordConfirm(e.target.value)} value={newPasswordConfirm} />
                    </div>
                    <button type="submit" onClick={sendNewPassword} className="passwordChange__form_button">パスワードを更新</button>
                </form>
            </div>
            <Form_footer />
        </div>
    )
};

export default PasswordChange;
