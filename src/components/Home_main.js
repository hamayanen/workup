import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home_main.css';
import bill_img from '../../img/bill.jpg';

const Home_main = () => {
    const [searchValue, setSearchValue] = useState("");

    const sendSearch = () => {
        sessionStorage.setItem('searchValue', searchValue)
    };

    return (
        <div className="main__body">
            <img src={bill_img} className="main__body_img"/>
            <form className="main__body_form">
                <div className="wrapper__input_left">
                    <label htmlFor="keyword" className="text__input_label">キーワード検索</label>
                    <input type="text" placeholder="キーワード、企業名、勤務地" id="keyword" className="main__body_input" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                </div>
                <Link to={searchValue && '/jobs?' + searchValue}><button type="submit" className="main__body_button" onClick={sendSearch}><i className="fas fa-search"></i>&nbsp;求人検索</button></Link>
            </form>
        </div>
    )
};

export default Home_main;