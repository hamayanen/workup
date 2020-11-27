import React, { useState, useEffect } from 'react';
import Jobs_nav from './Jobs_nav';
import ReactPaginate from 'react-paginate';
import '../styles/Jobs.css';
import axios from 'axios';

const Jobs = () => {
    const perPage = 5;

    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    let displayPage = sessionStorage.getItem('currentPage') ? sessionStorage.getItem('currentPage') : 0

    const filterFunction = (data, values) => {
        const filterData = data.filter((el) => {
            return el.title.includes(values) ||
                el.companyName.includes(values) ||
                el.location.includes(values) ||
                el.employStatus.includes(values);
        });
        return filterData
    }

    const sendSearch = async (e) => {
        setLoading(true);

        e.preventDefault();

        const res = await axios.get('http://127.0.0.1:3000/api/v1/jobs');

        setLoading(false);

        const filterData = filterFunction(res.data.data.data, searchValue);

        sessionStorage.setItem('searchValue', searchValue)
        sessionStorage.setItem('currentPage', 0);
        setCurrentPage(0);
        displayPage = 0;
        if(filterData.length){
            setError("");
            setData(filterData) 
        } else { 
            setError('*一致する職が見つかりませんでした。')
        };
    };
    
    const fetchPosts = async () => {
        if(sessionStorage.getItem('searchValue')) {
            setLoading(true);

            setSearchValue(sessionStorage.getItem('searchValue'))

            const res = await axios.get('http://127.0.0.1:3000/api/v1/jobs');

            setLoading(false)
            
            const filterData = filterFunction(res.data.data.data, sessionStorage.getItem('searchValue'));

            sessionStorage.setItem('currentPage', 0);
            setCurrentPage(0);
            displayPage = 0;
            if(filterData.length){
                setError("");
                setData(filterData) 
            } else { 
                setError('*一致する職が見つかりませんでした。')
            };
        } else {
            const res = await axios.get('http://127.0.0.1:3000/api/v1/jobs'); 
            setData(res.data.data.data);
        }
    };

    useEffect(() => {
        setCurrentPage(displayPage);
        fetchPosts();
    },[]);

    const handlePageClick = ({ selected: selectedPage }) => {
        sessionStorage.setItem('currentPage', selectedPage);
        setCurrentPage(selectedPage);
    };
    
    const offset = currentPage * perPage;

    const currentPageData = data.slice(offset, offset + perPage).map(post => (
        <div key={post._id} className="jobs__list_items">
            <h1>{post.title}</h1>
            <p className="">{post.companyName}</p>
            <p>{post.location}</p>
            <h3>
                {post.hourlyWage ? '時給 ' + post.hourlyWage + '円' : '月給 ' + post.monthlySalaryMin}
                {post.monthlySalaryMax && ' ~ ' + post.monthlySalaryMax + '万円'}
            </h3>
            <p>{post.employStatus}</p>
            <p className="summary">{post.summary}</p>
            <a href="#"><i className="fas fa-angle-right"></i>&nbsp;応募する</a>
        </div>
    ))

    const pageCount = Math.ceil(data.length / perPage);

    return (
        <div className="jobs">
            <Jobs_nav />
            <div className="jobs__container">
                <form className="jobs__body_form">
                    <div className="wrapper__input_left_jobs">
                        <label htmlFor="keyword" placeholder="キーワード、企業名" className="text__input_label_jobs">キーワード検索</label>
                        <input type="text" id="keyword" className="jobs__body_input" value={searchValue} onChange={e => setSearchValue(e.target.value.trim())} />
                    </div>
                    <button type="submit" className="jobs__body_button" onClick={sendSearch}><i className="fas fa-search"></i>&nbsp;求人検索</button>
                </form>
                <div className="jobs__list">
                    {loading && (<p className="loader"></p>)}
                    {error ? (<p className="jobs__list_error">{error}</p>) : currentPageData}
                </div>
                { !error && 
                    (<ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={pageCount}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={0}
                        onPageChange={handlePageClick}
                        initialPage={parseInt(displayPage)}
                        forcePage={parseInt(displayPage)}
                        containerClassName={"jobs__pagination"}
                        previousClassName={"jobs__pagination_link"}
                        nextClassName={"jobs__pagination_link"}
                        disabledClassName={"jobs__pagination_link--disabled"}
                        activeClassName={"jobs__pagination_link--active"}
                    />)
                }
            </div>
        </div>
    )
};

export default Jobs;