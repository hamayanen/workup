import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form_footer from './Form__footer';
import '../styles/Signup.css';
import axios from './axios';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");

    const sendSignup = async (e) => {
        e.preventDefault();

        try {
            const res = await axios({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                url: '/users/signup',
                data: {
                    email,
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
        };

        setEmail("");
        setPassword("");
        setPasswordConfirm("");
    }

    return (
        <div className="signup__container">
            <Link to="/" className="signup__container_logo">WORKUP</Link>
            <div className="signup__wrapper">
                <form className="signup__form">
                    <h3>アカウント作成</h3>
                    {
                        error && (<p className="signup__error">*{error}</p>)
                    }
                    <div className="signup__form_wrapper">
                        <label htmlFor="mail"><i className="far fa-envelope"></i>&nbsp;メールアドレスを入力</label>
                        <input type="email" id="mail" placeholder="メールアドレスを入力" onChange={e => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className="signup__form_wrapper">
                        <label htmlFor="password"><i className="fas fa-unlock-alt"></i>&nbsp;パスワード</label>
                        <input type="password" id="password" placeholder="パスワードを入力" onChange={e => setPassword(e.target.value)} value={password} />
                    </div>
                    <div className="signup__form_wrapper">
                        <label htmlFor="passwordConfirm"><i className="fas fa-unlock-alt"></i>&nbsp;パスワード確認用</label>
                        <input type="password" id="passwordConfirm" placeholder="上記と同じものを入力" onChange={e => setPasswordConfirm(e.target.value)} value={passwordConfirm} />
                    </div>
                    <button type="submit" onClick={sendSignup} className="signup__form_button">アカウントを作成</button>
                    <hr/>
                    <div className="to__login">
                        <p>アカウントをお持ちの場合は↓</p>
                        <Link to="/login" className="signup__form_button to__login_button">ログイン</Link>
                    </div>
                    <div className="forget_password forget_password_signup">
                        <Link to="/forgotPassword">パスワードを忘れた方はこちら</Link>
                    </div>
                    <hr/>
                    <div className="signup__form_policy">アカウントを作成することにより、あなたは WORKUP の利用規約、Cookie ポリシーおよびプライバシー規約に同意するものとします。</div>
                </form>
            </div>
            <Form_footer />
        </div>
    )
};

export default Signup;
