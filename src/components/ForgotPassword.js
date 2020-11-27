import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form_footer from './Form__footer';
import axios from './axios';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const sendPasswordReset = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
                data: {
                    email, 
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
        <div className="passwordReset__container">
            <Link to="/" className="passwordReset__container_logo">WORKUP</Link>
            <div className="passwordReset__wrapper">
                <form className="passwordReset__form" onSubmit={sendPasswordReset}>
                    <h3>パスワードをリセット</h3>
                    {
                        error && (<p className="passwordReset__error">*{error}</p>)
                    }
                    <div className="passwordReset__form_wrapper">
                        <label htmlFor="mail"><i className="far fa-envelope"></i>&nbsp;メールアドレスを入力</label>
                        <input type="email" id="mail" placeholder="メールアドレスを入力" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="passwordReset__form_button">メールアドレスに送信</button>
                </form>
            </div>
            <Form_footer />
        </div>
    )
};

export default ForgotPassword;