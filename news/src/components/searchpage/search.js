import styles from './search.module.css'
import categoryStyles from '../category/category.module.css'
import { BrowserRouter as Router, Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import fetchHtml from './loadDOM'
import axios from 'axios';
import fetchHTML from '../home/loadDOM';
import { Cheerio } from 'cheerio';
import useEffectOnce from '../useEffectOne';
import { useLocation } from 'react-router-dom';
import SpeechRecognitionComponent from '../voice/voice';
import {FaSearch} from "react-icons/fa";
const cheerio = require('cheerio');
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const query = useQuery();
    const navigate = useNavigate();
    const [blogs , setBlogs] = useState([])
    const [page, setPage] = useState(1);
    const [content, setContent] = useState(query.get('content') || '');
    const [filter, setFilter] = useState(query.get('filter') || 'moi-nhat');
    const [prepage, setPrepage] = useState(false);
    const [nextpage, setNextPage] = useState(false);
    const limit = 5;
    const [totalPages, setTotalPages] = useState(0);
    async function fetch() {
        try {
            const response1 = await axios.post(`https://localhost:7125/Search/search?content=${encodeURI(content)}&page=${encodeURI(page)}&limit=${limit}&filter=${encodeURI(filter)}`)
            const response2 = await axios.post(`https://localhost:7125/PaginationCotroller/paginationSearch?content=${encodeURI(content)}&limit=${limit}`)
            const blogData =response1.data;
            const totalPageData = response2.data;
            setBlogs(blogData);
            setTotalPages(totalPageData)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        fetch();
        navigate(`/searchPage/timkiem?content=${content}&page=${page}&filter=${filter}`)
    }, [content, filter, page])
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'content') {
            setContent(value)
        } else if (name === 'filter') {
            setFilter(value);
        }
    };
    const listItems = [];

    for (let i = 1; i <= totalPages; i++) {
        listItems.push(
            <li className={`${categoryStyles['pagination__list-item']} ${i === page ? categoryStyles.active : ''}`}>
                <a onClick={() => setPage(i)} style={{cursor: "pointer"}}>{i}</a>
            </li>
        );
    }
    const controlPage = (totalPages) => {
        if(page > 1) {
            setPrepage(true)
        } else {
            setPrepage(false)
        }
        if (page < totalPages) {
            setNextPage(true)
        }
        if (totalPages == 1 || page === totalPages) {
            setNextPage(false)
        }
    }
    useEffect(() => {
        controlPage(totalPages)
    }, [totalPages, page]);
    return (
        <div className={styles.main}>
            <div className={`${styles.container} ${styles.typeFull}`}>
                <div class="formSearch mt-5">
                    <div className={styles['formSearch__head']}>
                        <h1>Kết quả tìm kiếm</h1>
                    </div>
                    <SpeechRecognitionComponent setQuery={setContent} />
                    <div  className={styles['formSearch__main']} accept-charset="UTF-8">
                        <div className={styles.field} >
                            <input class="keyword" type="text" onChange={handleChange} value={content} name="content" placeholder="Keyword tÃ¬m kiá»ƒm (VD: VÄƒn Mai HÆ°Æ¡ng)" />
                        </div>
                        <div className={styles.fields} >
                            <div className={styles.field}>
                                <label for="">Sắp xếp theo</label>
                                <select value={filter} filter="select" name="filter" onChange={handleChange}>
                                    <option value="cu-nhat">Cũ nhất</option>
                                    <option selected value="moi-nhat">Mới nhất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {blogs.length == 0 && <div>Không tìm thấy kết quả</div>}
                <div className={categoryStyles['topStory-15nd']}>
                    {blogs.map((item, index) => (
                        <div className={` ${categoryStyles.horizontalPost} ${categoryStyles['version-news']} ${'mb-20'}  `}  >
                            <div className={` ${categoryStyles['horizontalPost__avt']} ${categoryStyles['avt-240']} `} >
                                <Link to={"/detail/" + item.id}>
                                    <picture>
                                        <source data-srcset={item.image} media="(max-width: 767px)" srcset={item.image} />
                                        <source data-srcset={item.image} media="(max-width: 1023px)" srcset={item.image} />
                                        <img src={item.image} class=" lazy-loaded" data-srcset={item.image} alt={item.title} srcset={item.image} />
                                    </picture>
                                </Link>
                            </div>
                            <div className={categoryStyles['horizontalPost__main']} >
                                <h3 className={` ${categoryStyles['horizontalPost__main-title']} ${categoryStyles['vnn-title']} ${categoryStyles['title-bold']} `} data-id="2291894" ispr="False">
                                    <Link to={"/detail/" + item.id} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1" data-limit="">
                                        {item.title}
                                    </Link>
                                </h3>
                                <div className={categoryStyles['horizontalPost__main-desc']} data-limit="">
                                    <p>{item.shortDescription}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={categoryStyles.pagination}>
                <ul className={categoryStyles['pagination__list']}>
                    {prepage && (
                        <li className={`${categoryStyles['pagination__list-item']} ${categoryStyles['pre-page']}`}>
                            <a onClick={() => setPage(page - 1)} style={{cursor: "pointer"}}>
                                <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon prev"/>
                            </a>
                        </li>)}
                    {listItems}
                    {nextpage && <li className={`${categoryStyles['pagination__list-item']}`}>
                        <a onClick={() => setPage(page + 1)} style={{cursor: "pointer"}}>
                            <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon next"/>
                        </a>
                    </li>}
                </ul>
            </div>

        </div>
    )
}

// function Search() {
//     const navigate = useNavigate();
//     const [top15Story, setTop15Story] = useState([]);
//     const location = useLocation()
//
//     const [pageList, setPageList] = useState([]);
//     const [prepage, setPrePage] = useState(null);
//     const [nextpage, setNextPage] = useState(null);
//
//     const [q, setQ] = useState([''])
//     const [od, setOd] = useState(['1'])
//     const [newstype, setNewstype] = useState(['1'])
//     const [bydayerang, setBydaterang] = useState(['1'])
//     async function fetch() {
//         let html = await fetchHTML('https://vietnamnet.vn/' + location.pathname.replace("/searchPage", "") + location.search);
//         const $ = cheerio.load(html);
//         const data = $('.newsStream').find('.horizontalPost');
//         setTop15Story([])
//         await data.each(function (index, element) {
//             const $post = $(element);
//             setTop15Story((state) => [
//                 ...state, {
//                     img: $post.find('.horizontalPost__avt').find('a').find('picture').find('img').attr('data-srcset'),
//                     title: $post.find('.horizontalPost__avt').find('a').attr('title'),
//                     url: $post.find('.horizontalPost__avt').find('a').attr('href').toString().replace("https://vietnamnet.vn", ""),
//                     content: $post.find('.horizontalPost__main').find('.horizontalPost__main-desc').find('p').text()
//                 }
//             ])
//         });
//     }
//     useEffectOnce(() => {
//         fetch()
//     }, []);
//
//     useEffectOnce(() => {
//         async function fetch() {
//             let html = await fetchHTML('https://vietnamnet.vn/' + location.pathname.replace("/searchPage", "") + location.search);
//             const $ = cheerio.load(html);
//             const data = $('.pagination__list').find('li').not('.block');
//             const pre = $('.pagination__list').find('.pagination-prev');
//             const next = $('.pagination__list').find('.pagination-next');
//             setPrePage({
//                 url: pre.find('a').attr('href'),
//             })
//             setNextPage({
//                 url: next.find('a').attr('href'),
//             })
//             setPageList([])
//             await data.each(function (index, element) {
//                 const $page = $(element);
//                 setPageList((state) => [
//                     ...state, {
//                         index: $page.find('a').text(),
//                         url: $page.find('a').attr('href'),
//                         isActive: $page.hasClass('active')
//                     }
//                 ])
//             });
//         }
//         fetch()
//     }, []);
//     const handleChange = (event) => {
//         var formData = new FormData(event.target.form);
//         var params = new URLSearchParams(formData).toString();
//         console.log('Query parameters:', params);
//         console.log(location.pathname)
//
//         event.target.form.submit();
//
//     };
//     const query = useQuery();
//     useEffectOnce(() => {
//         setQ(query.get('q'))
//         setOd(query.get('od'))
//         setNewstype(query.get('newstype'))
//         setBydaterang(query.get('bydaterang'))
//
//     }, [])
//     return (
//         <div className={styles.main}>
//             <div className={`${styles.container} ${styles.typeFull}`}>
//                 <div class="formSearch mt-5">
//                     <div className={styles['formSearch__head']} >
//                         <h1>Káº¿t quáº£ tÃ¬m kiáº¿m</h1>
//                     </div>
//                     <SpeechRecognitionComponent setQuery={setQ} />
//                     <form onsubmit="return false" className={styles['formSearch__main']} action='/searchPage/tim-kiem' accept-charset="UTF-8">
//                         <div className={styles.field} >
//                             <input class="keyword" type="text" defaultValue={q} name="q" placeholder="Keyword tÃ¬m kiá»ƒm (VD: VÄƒn Mai HÆ°Æ¡ng)" />
//                             <div className={styles.inSearch}>
//                                 <button onChange={handleChange}>
//                                     {/*<span class="icon-search"></span>*/}
//                                     <FaSearch/>
//                                 </button>
//                             </div>
//                         </div>
//                         <div className={styles.fields} >
//                             <div className={styles.field}>
//                                 <label for="">Sáº¯p xáº¿p theo</label>
//                                 <select value={od} filter="select" name="od" onChange={handleChange}>
//                                     <option value="1">CÅ© nháº¥t</option>
//                                     <option selected="" value="2">Má»›i nháº¥t</option>
//                                 </select>
//                             </div>
//                             <div value={od} className={styles.field}>
//                                 <label for="">Thá»i gian</label>
//                                 <select value={bydayerang} filter="select" name="bydaterang" onChange={handleChange}>
//                                     <option value="all">Táº¥t cáº£</option>
//                                     <option value="1">Theo NgÃ y</option>
//                                     <option value="2">Theo Tuáº§n</option>
//                                     <option value="3">Theo ThÃ¡ng</option>
//                                     <option value="4">Theo NÄƒm</option>
//                                 </select>
//                             </div>
//                             <div className={styles.field}>
//                                 <label for="">Loáº¡i tin bÃ i</label>
//                                 <select value={newstype} filter="select" name="newstype" onChange={handleChange}>
//                                     <option value="all">Táº¥t cáº£</option>
//                                     <option value="1">BÃ i thÆ°á»ng</option>
//                                     <option value="2">BÃ i áº£nh</option>
//                                     <option value="3">BÃ i video</option>
//                                     <option value="4">BÃ i Podcast</option>
//                                     <option value="5">BÃ i EMagazine</option>
//                                     <option value="6">BÃ i StoryScroll</option>
//                                     <option value="7">BÃ i Infographic</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//                 {top15Story.length == 0 && <div>KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£</div>}
//                 <div className={categoryStyles['topStory-15nd']}>
//                     {top15Story.map((item, index) => (
//                         <div className={` ${categoryStyles.horizontalPost} ${categoryStyles['version-news']} ${'mb-20'}  `}  >
//                             <div className={` ${categoryStyles['horizontalPost__avt']} ${categoryStyles['avt-240']} `} >
//                                 <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1">
//                                     <picture>
//                                         <source data-srcset={item.img} media="(max-width: 767px)" srcset={item.img} />
//                                         <source data-srcset={item.img} media="(max-width: 1023px)" srcset={item.img} />
//                                         <img src={item.img} class=" lazy-loaded" data-srcset={item.img} alt={item.title} srcset={item.img} />
//                                     </picture>
//                                 </a>
//                             </div>
//                             <div className={categoryStyles['horizontalPost__main']} >
//                                 <h3 className={` ${categoryStyles['horizontalPost__main-title']} ${categoryStyles['vnn-title']} ${categoryStyles['title-bold']} `} data-id="2291894" ispr="False">
//                                     <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1" data-limit="">
//                                         {item.title}
//                                     </a>
//                                 </h3>
//                                 <div className={categoryStyles['horizontalPost__main-desc']} data-limit="">
//                                     <p>{item.content}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//
//                 </div>
//             </div>
//             <div className={categoryStyles.pagination} >
//                 <ul className={categoryStyles['pagination__list']} >
//                     {prepage && (<li className={`${categoryStyles['pagination__list-item']} ${categoryStyles['pre-page']}`} >
//                         <a href={"/searchPage" + prepage.url}>
//                             <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon prev" />
//                         </a>
//                     </li>)}
//
//                     {pageList.map((item, index) => (
//                         <li className={`${categoryStyles['pagination__list-item']} ${item.isActive ? categoryStyles.active : ''}`} >
//                             <a href={"/searchPage" + item.url}>{item.index}</a>
//                         </li>
//                     ))}
//                     {nextpage && <li className={`${categoryStyles['pagination__list-item']}`}>
//                         <a href={"/searchPage" + nextpage.url}>
//                             <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon next" />
//                         </a>
//                     </li>}
//
//                 </ul>
//             </div>
//
//         </div>
//     )
// }
export default Search;