import React from 'react';
import '../styles/Home_footer.css';

const Home_footer = () => {
    return (
        <div className="footer__body">
            <a href="" className="footer__logo">WORKUP</a>
            <div className="footer__body_link">
                <a href="">会社概要</a>
                <span>|</span>
                <a href="">プライバシー</a>
                <span>|</span>
                <a href="">採用</a>
                <span>|</span>
                <a href="">利用規約</a>
            </div>
            <p className="footer__copyright">Copyright &copy; workup</p>
        </div>
    )
};

export default Home_footer;