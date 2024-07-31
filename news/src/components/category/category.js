
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import styles from "./category.module.css"
import React, { useEffect, useState } from 'react';
// import fetchHtml from './loadDOM'
import axios from 'axios';
import fetchHTML, { fetchRss } from '../home/loadDOM';
import { Cheerio } from 'cheerio';
import useEffectOnce from '../useEffectOne';
import { PaginatedItems } from './pagination';


const cheerio = require('cheerio');
function Category() {



    const { category, subcategory } = useParams();
    const [title, setTitle] = useState('');
    const [subtitle, setSubTitle] = useState([]);

    const [topStory, setTopStory] = useState(null);
    const [top2Story, setTop2Story] = useState([]);
    const [top3Story, setTop3Story] = useState([]);
    const [top15Story, setTop15Story] = useState([]);

    const [pageList, setPageList] = useState([]);
    const [prepage, setPrePage] = useState(null);
    const [nextpage, setNextPage] = useState(null);
    // hàm chuển đổi chuỗi có các ký tự đặc biệt
    function decodeHTMLEntities(text) {
        const entities = {
            '&apos;': "'",
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            // Thêm các ký tự HTML entities khác nếu cần
        };

        // Thay thế các ký tự HTML entities cụ thể
        Object.keys(entities).forEach(function(entity) {
            const regex = new RegExp(entity, 'g');
            text = text.replace(regex, entities[entity]);
        });

        // Sử dụng DOMParser để giải mã các ký tự còn lại
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.documentElement.textContent || text;
    }

    useEffectOnce(() => {
        async function fetch() {
            let html;
            let link;
            if (subcategory != undefined) {
                html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
                link = 'https://vietnamnet.vn/' + category + "/" + subcategory +".rss";

            }
            if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); 
                link = 'https://vietnamnet.vn/' + category +".rss";
            }



           
            const rss = await fetchRss(link);
            
            // Parse RSS feed
            const parser = new DOMParser();
            const xml = parser.parseFromString(rss, 'application/xml');
            const items = Array.from(xml.querySelectorAll('item')).map(item => {
                const title = decodeHTMLEntities(item.querySelector('title')?.textContent || '');
                const url = item.querySelector('link')?.textContent.replaceAll("https://vietnamnet.vn/" , "/") || '';
                const description = item.querySelector('description')?.textContent || '';

                // Use cheerio to parse the description HTML and extract the image URL
                const $ = cheerio.load(description);
                const img = $('img').attr('src') || '';
                // Extract the text after <br> by splitting the HTML content
                const content = $('br').get(0)?.nextSibling?.nodeValue?.trim() || '';

                return {
                    title,
                    url,
                    content,
                    img
                };
            });
            
            setTopStory(items[0]);
            setTop2Story(items.slice(1,3));
            setTop3Story(items.slice(3,6));
            setTop15Story(items.slice(6,21));
            const $ = cheerio.load(html);
            const data = $('.breadcrumb');
            setTitle(data.find('.breadcrumb__heading').find('a').text())
            const subtitles = data.find('.breadcrumb__main').find('ul').find('li');
            setSubTitle([])
            await subtitles.each(function (index, element) {
                const $subtitle = $(element);
                setSubTitle((state) => [
                    ...state, {
                        url: $subtitle.find('a').attr('href'),
                        content: $subtitle.find('a').text(),
                        title: $subtitle.find('a').attr('title')
                    }
                ])
            });

        }
        fetch()
    }, [subcategory]); // Gọi chỉ một lần khi component được render lần đầu tiên
    // useEffectOnce(() => {
    //     async function fetch() {
    //         let html;
    //         if (subcategory != undefined) {
    //             html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
    //         }
    //         if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); }
    //         const $ = cheerio.load(html);
    //         const data = $('.topStory-1nd');
    //         setTopStory({
    //             img: data.find('.verticalPost__avt').find('a').find('img').attr('src'),
    //             title: data.find('.verticalPost__avt').find('a').attr('title'),
    //             url: data.find('.verticalPost__avt').find('a').attr('href'),
    //             content: data.find('.verticalPost__main-desc').find('p').text()
    //         })
    //     }
    //     fetch()
    // }, [subcategory]);
    // useEffectOnce(() => {
    //     async function fetch() {
    //         let html;
    //         if (subcategory != undefined) {
    //             html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
    //         }
    //         if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); }
    //         const $ = cheerio.load(html);
    //         const data = $('.topStory-2nd').find('.verticalPost');
    //         setTop2Story([])
    //         await data.each(function (index, element) {
    //             const $post = $(element);
    //             setTop2Story((state) => [
    //                 ...state, {
    //                     img: $post.find('.verticalPost__avt').find('a').find('img').attr('src'),
    //                     title: $post.find('.verticalPost__avt').find('a').attr('title'),
    //                     url: $post.find('.verticalPost__avt').find('a').attr('href'),
    //                     category: $post.find('.verticalPost__main').find('.verticalPost__main-cate').find('a').text(),
    //                     content: $post.find('.verticalPost__main').find('.verticalPost__main-title').find('a').text()
    //                 }
    //             ])
    //         });
    //     }
    //     fetch()
    // }, [subcategory]);
    // useEffectOnce(() => {
    //     async function fetch() {
    //         let html;
    //         if (subcategory != undefined) {
    //             html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
    //         }
    //         if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); }
    //         const $ = cheerio.load(html);
    //         const data = $('.topStory-3nd').find('.verticalPost');
    //         setTop3Story([])
    //         await data.each(function (index, element) {
    //             const $post = $(element);
    //             setTop3Story((state) => [
    //                 ...state, {
    //                     img: $post.find('.verticalPost__avt').find('a').find('img').attr('src'),
    //                     title: $post.find('.verticalPost__avt').find('a').attr('title'),
    //                     url: $post.find('.verticalPost__avt').find('a').attr('href'),
    //                     category: $post.find('.verticalPost__main').find('.verticalPost__main-cate').find('a').text(),
    //                     content: $post.find('.verticalPost__main').find('.verticalPost__main-title').find('a').text()
    //                 }
    //             ])
    //         });
    //     }
    //     fetch()
    // }, [subcategory]);
    // useEffectOnce(() => {
    //     async function fetch() {
    //         let html;
    //         if (subcategory != undefined) {
    //             html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
    //         }
    //         if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); }
    //         const $ = cheerio.load(html);
    //         const data = $('.topStory-15nd').find('.horizontalPost');
    //         setTop15Story([])
    //         await data.each(function (index, element) {
    //             const $post = $(element);
    //             setTop15Story((state) => [
    //                 ...state, {
    //                     img: $post.find('.horizontalPost__avt').find('a').find('source').attr('data-srcset'),
    //                     title: $post.find('.horizontalPost__avt').find('a').attr('title'),
    //                     url: $post.find('.horizontalPost__avt').find('a').attr('href'),
    //                     content: $post.find('.horizontalPost__main').find('.horizontalPost__main-desc').find('p').text()
    //                 }
    //             ])
    //         });
    //     }
    //     fetch()
    // }, [subcategory]);
    useEffectOnce(() => {
        async function fetch() {
            let html;
            if (subcategory != undefined) {
                html = await fetchHTML('https://vietnamnet.vn/' + category + "/" + subcategory);
            }
            if (subcategory == undefined) { html = await fetchHTML('https://vietnamnet.vn/' + category); }
            const $ = cheerio.load(html);
            const data = $('.pagination__list').find('li').not('.block');
            const pre = $('.pagination__list').find('.pagination-prev');
            const next = $('.pagination__list').find('.pagination-next');
            setPrePage({
                url: pre.find('a').attr('href'),
            })
            setNextPage({
                url: next.find('a').attr('href'),
            })
            setPageList([])
            await data.each(function (index, element) {
                const $page = $(element);
                setPageList((state) => [
                    ...state, {
                        index: $page.find('a').text(),
                        url: $page.find('a').attr('href'),
                        isActive: $page.hasClass('active')
                    }
                ])
            });
        }
        fetch()
    }, [subcategory]);
    return (
        <div className={styles.main}>
            <div className={styles.breadcrumbIsPin} >
                <div className={styles.breadcrumb} >
                    <div className={styles['breadcrumb__title']}>
                        <div class="breadcrumb__title-home active">
                            <a href="/" title="VietNamNet">
                                <span class="icon-home"></span>
                            </a>
                        </div>
                        <div class="breadcrumb__heading">
                            <h1><a title={title}>{title}</a></h1>
                            <div class="search-small">
                            </div>
                        </div>
                    </div>
                    <nav className={`${styles['breadcrumb__main']} ${styles.swiper}`}>
                        <ul class="swiper-wrapper" >
                            {subtitle.map((item, index) => (
                                <li class="swiper-slide">
                                    <a href={item.url} title={item.title} data-utm-source="#vnn_source=thethaoeuro&amp;vnn_medium=menu-top">{item.content}</a>
                                </li>
                            ))}
                        </ul>

                    </nav>

                </div>

            </div>
            <div className={` ${styles.container}  ${styles.sectionTopstory}  ${styles.normal - category}  ${'pb-0'}  ${'align-start'}  `} >
                <div className={styles['container__left']} >
                    {topStory && <div className={` ${styles.verticalPost} ${styles.verticalPost} ${styles['topStory-1nd']} ${styles['version-news']} ${'mb-20'} `} >
                        <div className={styles['verticalPost__avt']} >
                            <a href={"/detail" + topStory.url} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem1">
                                <picture>
                                    <source srcset={topStory.img} media="(max-width: 767px)" />
                                    <source srcset={topStory.img} media="(max-width: 1023px)" />
                                    <img src={topStory.img} alt={topStory.title} />
                                </picture>
                            </a>
                        </div>
                        <div className={styles['verticalPost__main']}>
                            <h2 className={`${styles['verticalPost__main-title']} ${styles['vnn-title']}`} data-id="2292526" ispr="False">
                                <a href={"/detail" + topStory.url} title={topStory.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem1" data-limit="">
                                    {topStory.title}
                                </a>
                            </h2>
                            <div className={`${styles['desc-big']} ${styles['verticalPost__main-desc']}`} data-limit="">
                                <p>{topStory.content}</p>
                            </div>
                        </div>
                    </div>}
                    <div className={styles['topStory-2nd']}>
                        {
                            top2Story.map((item, index) => (
                                <div class="verticalPost sm:lineSeparates version-news mb-20">
                                    <div class="verticalPost__avt ">
                                        <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem2">
                                            <picture>
                                                <source srcset={item.img} media="(max-width: 767px)" />
                                                <source srcset={item.img} media="(max-width: 1023px)" />
                                                <img src={item.img} alt={item.title} />
                                            </picture>

                                        </a>
                                    </div>
                                    <div className={styles['verticalPost__main']}>

                                        <h3 className={styles['verticalPost__main-title']} data-id="2292167" ispr="False">
                                            <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem2" data-limit="">
                                                {item.title}
                                            </a>
                                        </h3>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    <div className={styles['topStory-3nd']}>
                        {top3Story.map((item, index) => (
                            <div className={styles['verticalPost']}>
                                <div class="verticalPost__avt ">
                                    <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem4">

                                        <picture>
                                            <source srcset={item.img} media="(max-width: 767px)" />
                                            <source srcset={item.img} media="(max-width: 1023px)" />
                                            <img src={item.img} alt={item.title} />
                                        </picture>

                                    </a>
                                </div>
                                <div className={styles['verticalPost__main']}>
                                    <h3 className={styles['verticalPost__main-title']} data-id="2292091" ispr="False">
                                        <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=tiemdiem4" data-limit="">
                                            {item.title}
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className={styles['topStory-15nd']}>
                        {top15Story.map((item, index) => (
                            <div className={` ${styles.horizontalPost} ${styles['version-news']} ${'mb-20'}  `}  >
                                <div className={` ${styles['horizontalPost__avt']} ${styles['avt-240']} `} >
                                    <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1">
                                        <picture>
                                            <source data-srcset={item.img} media="(max-width: 767px)" srcset={item.img} />
                                            <source data-srcset={item.img} media="(max-width: 1023px)" srcset={item.img} />
                                            <img src={item.img} class=" lazy-loaded" data-srcset={item.img} alt={item.title} srcset={item.img} />
                                        </picture>
                                    </a>
                                </div>
                                <div className={styles['horizontalPost__main']} >
                                    <h3 className={` ${styles['horizontalPost__main-title']} ${styles['vnn-title']} ${styles['title-bold']} `} data-id="2291894" ispr="False">
                                        <a href={"/detail" + item.url} title={item.title} data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1" data-limit="">
                                            {item.title}
                                        </a>
                                    </h3>
                                    <div className={styles['horizontalPost__main-desc']} data-limit="">
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className={styles.pagination} >
                    <ul className={styles['pagination__list']} >
                        {prepage && (<li className={`${styles['pagination__list-item']} ${styles['pre-page']}`} >
                            <a href={prepage.url}>
                                <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon prev" />
                            </a>
                        </li>)}

                        {pageList.map((item, index) => (
                            <li className={`${styles['pagination__list-item']} ${item.isActive ? styles.active : ''}`} >
                                <a href={item.url}>{item.index}</a>
                            </li>
                        ))}
                        {nextpage && <li className={`${styles['pagination__list-item']}`}>
                            <a href={nextpage.url}>
                                <img src="https://static.vnncdn.net/v1/icon/icon-pagination.svg" alt="icon next" />
                            </a>
                        </li>}

                    </ul>
                </div>

            </div>
        </div>
    )
}
export default Category;