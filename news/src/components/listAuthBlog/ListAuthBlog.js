import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import  './AuthorStyle.css'
import AuthorProfile from '../listAuthBlog/AuthorProfile'
import Article  from '../listAuthBlog/Article'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {formatRelativeTime} from "../utils/dateUtils";
ListAuthBlog.propTypes = {


};

function ListAuthBlog(props) {

    // Lấy id từ url sử dụng useParams.
    const {id} = useParams();

    // Danh sách các bài viết của Article.
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 3;

    const [sortOrder, setSortOrder] = useState('newest'); // sort bài viết

    useEffect(() => {
        console.log("useEffect is running", { currentPage, id, sortOrder });
        let isCancelled = false;
        axios.get(`https://localhost:7125/Blog/profile/${id}?page=${currentPage}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
            .then(response => {
                if (!isCancelled) {
                if (response.data.length > 0) {
                    setArticles(prevArticles => [...prevArticles, ...response.data]);
                } else {
                    setHasMore(false);
                }
                }
            })
            .catch(error => console.error("[ListAuthBlog - lấy dữ liệu Article]", error));


        return () => {
            isCancelled = true; // Hủy bỏ việc cập nhật state nếu component đã unmount hoặc đang trong quá trình mount lại
        };
    }, [currentPage, id, sortOrder]);
        const handleShowMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
        setArticles(preArticles => [...preArticles,articleMore]);
    };
        function handleSortChange(e) {
            setSortOrder(e.target.value);
            setArticles([]); // Reset articles khi thay đổi sắp xếp
            setCurrentPage(1); // Reset lại trang hiện tại
            setHasMore(true); // Cho phép tải thêm nếu có
        }
    return (
        <div className="author-profiles">
        <div className="left-content">
            <AuthorProfile authorId={id}/>
        </div>
            <div className="right-content">
                <h1>Bài viết</h1>
                <div className="sort-options">
                    <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
                        <option value="newest">Gần đây nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="mostReact">Tương tác nhất</option>
                    </select>
                </div>
                <div className="list-article">
                    {articles.map(article => (
                        <Article
                            id={article.id}
                            title={article.title}
                            cateName={article.categoryName}
                            shortDes={article.shortDescription}
                            img={article.image}
                            date={formatRelativeTime(article.createdAt)}
                            authName={article.authName}
                            like={article.totalLike}
                            comment={article.totalComment}
                        />
                    ))}
                </div>
                {hasMore && (

                    <div onClick={handleShowMore} className="show-more-button">
                       <p> Xem thêm ... </p>
                    </div>

                )}

            </div>


        </div>
    );
}

export default ListAuthBlog;