import React, { useEffect, useState } from "react";
// import fetchHtml from './loadDOM'
import axios from "axios";
import fetchHTML from "./loadDOM";
import { Cheerio } from "cheerio";
import styles from "../home/home.module.css";
import useEffectOnce from "../useEffectOne";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaRing } from "react-icons/fa";

// const cheerio = require('cheerio');
function Home() {
  const [leftBlogs, setLeftBlogs] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [centerBlog, setCenterBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [blogByCategory, setBlogByCategory] = useState([]);

  async function fetch() {
    try {
      const getDataBlogs = await axios.post(
        "https://localhost:7125/Blog/getAllBlogs"
      );
      const getDataCategories = await axios.post(
        "https://localhost:7125/CategoryCotroller/category"
      );
      const blogs = getDataBlogs.data;
      setLeftBlogs(blogs.slice(0, 6));
      setCenterBlog(blogs.slice(6, 7)[0]);
      setTopBlogs(blogs.slice(7));
      const dataCategories = getDataCategories.data;
      const requests = dataCategories.slice(0, 5).map((item) =>
        axios
          .get(
            `https://localhost:7125/CategoryCotroller/category?id=${item.id}&page=1&limit=5`
          )
          .then((response) => ({
            name: item.name,
            blogs: response.data,
          }))
      );

      const responses = await Promise.all(requests);
      setBlogByCategory(responses);
    } catch (error) {
      console.error("Home error: ", error);
    }
  }

  function convertToSlug(str) {
    str = str.toLowerCase();
    // Thay thế các ký tự đặc biệt và dấu câu bằng khoảng trắng
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu trong các ký tự Unicode
    str = str.replace(/\s+/g, "-"); // Thay thế các khoảng trắng liên tiếp bằng dấu gạch ngang
    str = str.replace(/-+/g, "-"); // Thay thế các dấu gạch ngang liên tiếp bằng một dấu gạch ngang
    return str;
  }
  
  useEffect(() => {
    fetch();
  }, []);

  const checkBlogNew = (blog) => {
    var createDate = new Date(blog.createdAt);
    var now = new Date()
    return createDate.toDateString() === now.toDateString() ? true : false;
  }
  return (
    <>
      <div className={styles.sectionTopstory}>
        <div className={styles.sectionTopstory__left}>
          {leftBlogs.map((item, index) => (
            <div key={index} className={`${styles.horizontalPost} mb-20`}>
              <div className={`${styles.horizontalPost__avt} avt-140`}>
                <Link to={"/detail/" + item.id} title={item.title}>
                  <picture>
                    <img src={item.image} alt={item.title} />
                    {checkBlogNew(item) ? <p className={`${styles.newBlog}`}>mới</p> : ""}
                  </picture>
                </Link>
              </div>
              <div className={styles.horizontalPost__main}>
                <h3 className={styles["horizontalPost__main-title"]}>
                  <Link to={"/detail/" + item.id} title={item.title}>
                    {item.title}
                  </Link>
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sectionTopstory__center}>
          {centerBlog && (
            <div className="group-reverse">
              <div
                className={`${styles.verticalPost} version-news sm:lineSeparates topStory`}
              >
                <div className={styles.verticalPost__avt}>
                  <Link
                    to={"/detail/" + centerBlog.id}
                    title={centerBlog.title}
                  >
                    <picture>
                      <img src={centerBlog.image} alt={centerBlog.title} />
                    </picture>
                  </Link>
                </div>
                <div className={styles.verticalPost__main}>
                  <h2
                    className={`${styles["verticalPost__main-title"]} vnn-title`}
                  >
                    <Link
                      to={"/detail/" + centerBlog.id}
                      title={centerBlog.title}
                    >
                      {centerBlog.title}
                    </Link>
                  </h2>
                  <div
                    className={`${styles["verticalPost__main-desc"]} font-noto`}
                  >
                    {centerBlog.shortDescription}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.topStory_3nd}>
            {topBlogs.map((item, index) => (
              <div
                key={index}
                className={`${styles.verticalPost} version-news sm:lineSeparates`}
              >
                <div className={styles.verticalPost__avt}>
                  <Link to={"/detail/" + item.id} title={item.title}>
                    <picture>
                      <img src={item.image} alt={item.title} />
                    </picture>
                  </Link>
                </div>
                <div className={styles.verticalPost__main}>
                  <h3>
                    <Link to={"/detail/" + item.id} title={item.title}>
                      {item.title}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sectionTopstory__right}></div>
        <div className={styles.sectionTopstory__bottom}></div>
      </div>
      <div className={styles.home__block1}>
        <div className={styles.block1__groups}>
          <div className={styles.group1}>
            {blogByCategory.slice(0, 2).map((category, index) => (
              <div key={index} className={styles.boxCate}>
                <div className={styles.boxCate__head}>
                  <Link to={"/" + convertToSlug(category.name) + "?page=1"}>
                    {category.name}
                  </Link>
                </div>
                <div className={styles.boxCate__main}>
                  {category.blogs.map((subItem, subIndex) =>
                    subIndex === 0 ? (
                      <div key={subIndex} className={styles.boxCate__topItem}>
                        <img src={subItem.image} alt={subItem.title} />
                        <Link to={"/detail/" + subItem.id}>
                          {subItem.title}
                        </Link>
                      </div>
                    ) : (
                      <div key={subIndex} className={styles.boxCate__item}>
                        <Link to={"/detail/" + subItem.id}>
                          {subItem.title}
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.group2}>
            {blogByCategory.slice(2).map((category, index) => (
              <div key={index} className={styles.boxCate}>
                <div className={styles.boxCate__head}>
                  <Link to={"/"}>{category.name}</Link>
                </div>
                <div className={styles.boxCate__main}>
                  {category.blogs.map((subItem, subIndex) =>
                    subIndex === 0 ? (
                      <div key={subIndex} className={styles.boxCate__topItem}>
                        <img src={subItem.image} alt={subItem.title} />
                        <Link to={"/detail/" + subItem.id}>
                          {subItem.title}
                        </Link>
                      </div>
                    ) : (
                      <div key={subIndex} className={styles.boxCate__item}>
                        <Link to={"/detail/" + subItem.id}>
                          {subItem.title}
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
