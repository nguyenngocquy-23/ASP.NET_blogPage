import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import  './AuthorStyle.css'
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import axios from "axios";
import {Link} from "react-router-dom";


Article.propTypes = {

};
// Nếu descrip quá dài...
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function Article({key,title, cateName,shortDes,img, date, authName,like,comment}) {
    const maxLength = 125; // Độ dài tối đa cho shortDes

    return (
        <div>
        <div className="article">
            <div className="article-header">
                <img src={img} alt="article-header"/>
            </div>
            <div className="article-body">
                {/*tag-${tag.toLowerCase()}*/}
                    <span className={`tag `}>{cateName}</span>


                <h2>{title}</h2>
                <div className="article-user">
                    <img src="https://i.pinimg.com/564x/70/e4/ea/70e4ea4af5c79a543e3e79b1d67e1205.jpg" alt="user"/>
                    <div className="article-user-info">
                        <h5>{authName}</h5>
                        <small >{date}</small>
                    </div>
                </div>
                <p>{truncateText(shortDes, maxLength)}</p>

                <div className="article-footer">
                    <Link to={`/detail/ + ${key}`} className="article-btn"
                         data-limit="">
                       Chi tiết
                    </Link>

                    {/*<a href="#" className="article-btn">*/}
                    {/*    Đọc*/}
                    {/*</a>*/}
                    <div className="article-react-info">
                    <span className="react-item">{like} <AiFillLike className="react-icon"/></span>
                    <span className="react-item">
                            {comment} <FaComment className="react-icon"/>
                        </span>

                    </div>
                </div>

            </div>
        </div>

        </div>
    );
}

export default Article;