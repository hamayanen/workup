import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form_footer from './Form__footer';
import axios from './axios';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const sendLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                url: 'http://127.0.0.1:3000/api/v1/users/login',
                data: {
                    email, 
                    password
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
        <div className="login__container">
            <Link to="/" className="login__container_logo">WORKUP</Link>
            <div className="login__wrapper">
                <form className="login__form" onSubmit={sendLogin}>
                    <h3>ログイン</h3>
                    {
                        error && (<p className="login__error">*{error}</p>)
                    }
                    <div className="login__form_wrapper">
                        <label htmlFor="mail"><i className="far fa-envelope"></i>&nbsp;メールアドレスを入力</label>
                        <input type="email" id="mail" placeholder="メールアドレスを入力" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="login__form_wrapper">
                        <label htmlFor="password"><i className="fas fa-unlock-alt"></i>&nbsp;パスワード</label>
                        <input type="password" id="password" placeholder="パスワードを入力" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="login__form_button">ログイン</button>
                    <div className="forget_password">
                        <Link to="/forgotPassword">パスワードを忘れた方はこちら</Link>
                    </div>
                    <hr/>
                    <div className="to__newuser">
                        <p>初めてご利用の方は↓から無料でアカウント作成</p>
                        <Link to="/signup" className="login__form_button to__newuser_button">新規会員登録</Link>
                    </div>
                    <hr/>
                    <div className="login__form_policy">アカウントにログインすることにより、あなたは WORKUP の利用規約、Cookie ポリシーおよびプライバシー規約に同意するものとします。</div>
                </form>
            </div>
            <Form_footer />
        </div>
    )
};

export default Login;