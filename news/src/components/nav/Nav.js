
import styles from "./nav.module.css"
import {FaHome} from "react-icons/fa";
import axios from "axios"
import React, {useEffect, useState} from "react";
import category from "../category/category";
import {Link, useNavigate} from "react-router-dom";
function Nav() {
    const [categories, setCategories] = useState([]);
    const [showMore, setShowMore] = useState(false);
    async function fetch() {
        try {
            const response = await axios.post("https://localhost:7125/CategoryCotroller/category")
            setCategories(response.data);
            const category = {id:0, name:'Khác'};
            setCategories(categories=>[...categories, category]);
        } catch (error) {
            console.error("Nav error", error)
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        fetch();
    },[])

    useEffect(() => {
        if (categories.length > 6) setShowMore(true);
    }, [categories])
    function convertToSlug(str) {
        str = str.toLowerCase();
        // Thay thế các ký tự đặc biệt và dấu câu bằng khoảng trắng
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu trong các ký tự Unicode
        str = str.replace(/\s+/g, '-'); // Thay thế các khoảng trắng liên tiếp bằng dấu gạch ngang
        str = str.replace(/-+/g, '-'); // Thay thế các dấu gạch ngang liên tiếp bằng một dấu gạch ngang
        return str;
    }
    const handleClick = (url,id, name) => {
        navigate(`/${url}?page=1`, {state:{id: id, name: name}})
    }
    return (
        <div className={styles.wrapNav} >
            <nav className={styles.mainNav} >
                <ul className={styles.mainNav__list}>
                    <li className={styles['mainNav__list-item']}>
                        <Link class="btn-home" href="" title="Trang chủ"
                           data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            <span class="icon-home"><FaHome/></span>
                        </Link>
                    </li>
                    {categories.length <= 0 ? (
                        <></>
                    ) : (
                        categories.map((category, index) => (
                            index <= 5 ? (
                                <li key={index} className={styles['mainNav__list-item']}>
                                    <a
                                        title={category.name}
                                        href=""
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handleClick(convertToSlug(category.name), category.id, category.name)
                                        }}
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ) : <></>
                        ))
                    )}
                    {showMore ? (
                        <li className={styles['mainNav__list-item']}>
                            <a>▼</a>
                            <ul className={styles['sub-menu']}>
                                {categories.map((category, index) => (
                                    index > 5 ? (
                                        <li key={index} className={styles['mainNav__list-item']}>
                                            <a className={styles["sub-menu__title"]}
                                               title={category.name}
                                               href=""
                                               onClick={(event) => {
                                                   event.preventDefault();
                                                   handleClick(convertToSlug(category.name), category.id, category.name)}}
                                            >
                                                {category.name}
                                            </a>
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        </li>
                    ) : null}
                </ul>
            </nav>
        </div>
    )
}

export default Nav;