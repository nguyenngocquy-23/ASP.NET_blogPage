import React, {useEffect, useState} from 'react';
// import fetchHtml from './loadDOM'
import axios from 'axios';
import fetchHTML from './loadDOM';
import {Cheerio} from 'cheerio';
import styles from '../home/home.module.css';
import useEffectOnce from '../useEffectOne';
import {Link} from "react-router-dom";


const cheerio = require('cheerio');

function Home() {
    const [leftStory, setLeftStory] = useState([]);
    const [top3Story, setTop3Story] = useState([]);
    const [centerStory, setCenterStory] = useState(null);

    useEffectOnce(() => {
        async function fetch() {
            const html = await fetchHTML('https://vietnamnet.vn/')
            const $ = cheerio.load(html);
            const posts = $('.sectionTopstory__left').find('div.horizontalPost');
            // setLeftStory([])
            await posts.each(function (index, element) {
                // element là mỗi thẻ div con
                const $post = $(element);
                setLeftStory((state) => [
                    ...state, {
                        detail: $post.find('.horizontalPost__avt').find('a').attr('href'),
                        title: $post.find('.horizontalPost__avt').find('a').attr('title'),
                        source: $post.find('.horizontalPost__avt').find('a').find('picture').find('source').attr('srcset'),
                        img: $post.find('.horizontalPost__avt').find('a').find('picture').find('img').attr('src'),

                        desc: $post.find(".horizontalPost__main").find('h3').find('a').text()
                    }
                ])
            });
        }

        fetch()
    }, []); // Gọi chỉ một lần khi component được render lần đầu tiên
    useEffectOnce(() => {
        async function fetch() {
            const html = await fetchHTML('https://vietnamnet.vn/')
            const $ = cheerio.load(html);
            const posts = $('.topStory_3nd').find('.verticalPost');
            // setLeftStory([])
            await posts.each(function (index, element) {
                // element là mỗi thẻ div con
                const $post = $(element);
                setTop3Story((state) => [
                    ...state, {
                        content: $post.find('.verticalPost__main').find('a').text(),
                        url: $post.find('.verticalPost__avt').find('a').attr('href'),
                        img: $post.find('.verticalPost__avt').find('a').find('picture').find('img').attr('src'),
                    }
                ])
            });
        }

        fetch()
    }, []); // Gọi chỉ một lần khi component được render lần đầu tiên
    useEffectOnce(() => {
        async function fetch() {
            const html = await fetchHTML('https://vietnamnet.vn/')
            const $ = cheerio.load(html);
            const post = $('.topStory');
            console.log(post.html())
            const img = post.find('img').attr('src');
            const url = post.find('.verticalPost__avt').find('a').attr('href');
            const content = post.find('img').attr('alt');
            const desc = post.find('.verticalPost__main-desc').text();
            setCenterStory({
                img: img,
                url: url,
                content: content,
                desc: desc
            })
        }

        fetch()
    }, []); // Gọi chỉ một lần khi component được render lần đầu tiên
    const fetchRSSItems = async (url) => {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data, { xmlMode: true });
            const items = [];
            $('item').slice(0, 5).each((index, element) => {
                const title = decodeHTMLEntities($(element).find('title').text());
                const link = '/detail/'+extractLinkPath($(element).find('link').text());
                const description = $(element).find('description').text();
                const $description = cheerio.load(description);
                const imageUrl = $description('img').attr('src') || '';
                items.push({ title, link, imageUrl });
            });
            return items;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return [];
        }
    };
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
    function extractLinkPath(url){
        const parts = url.split('/');
        return parts[parts.length - 1];
    };
    const RSSFeed = ({ feedUrl, title }) => {
        const [items, setItems] = useState([]);

        useEffect(() => {
            const getRSSItems = async () => {
                const rssItems = await fetchRSSItems(feedUrl);
                setItems(rssItems);
            };
            getRSSItems();
        }, [feedUrl]);
        function convertRssUrlToLocalUrl(rssUrl) {
            const url = new URL(rssUrl);
            const path = url.pathname.split('.rss')[0]; // Lấy phần đường dẫn trước '.rss'
            return `http://localhost:3000${path}`;
        }
        return (
            <div className={styles.boxCate}>
                <div className={styles.boxCate__head}>
                    <Link to={convertRssUrlToLocalUrl(feedUrl)}>{title}</Link>
                </div>
                <div className={styles.boxCate__main}>
                    {items.map((item, index) => (
                        index === 0 ? (
                            <div key={index} className={styles.boxCate__topItem}>
                                <img src={item.imageUrl} alt={item.title} />
                                <Link to={item.link}>
                                    {item.title}
                                </Link>
                            </div>
                        ) : (
                            <div key={index} className={styles.boxCate__item}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                </a>
                            </div>
                        )
                        ))}
                </div>
            </div>
        );
    };
    const feeds = {
        tin_noi_bat: 'https://localhost:7125/AdminBlog/tin_noi_bat',
        the_thao: 'https://localhost:7125/AdminBlog/the-thao',
        phong_ban: 'https://localhost:7125/AdminBlog/phong-ban',
        nhan_su: 'https://localhost:7125/AdminBlog/nhan-su',
        qui_dinh: 'https://localhost:7125/AdminBlog/qui-dinh',
        chinh_sach: 'https://localhost:7125/AdminBlog/chinh-sach',
    };
    return (
        <>
            <div className={styles.sectionTopstory}>
                <div className={styles.sectionTopstory__left}>
                    {leftStory.map((item, index) => (
                        <div className={`${styles.horizontalPost} ` + " mb-20"}>
                            <div className={styles.horizontalPost__avt + " avt-140"}>
                                <a href={"/detail" + item.detail} title={item.title}>
                                    <picture>
                                        <source srcSet={item.source}/>
                                        <img data-original={item.title} src={item.img}/>
                                    </picture>
                                </a>
                            </div>
                            <div className={styles.horizontalPost__main}>
                                <h3 data-id="2287137" className={styles['horizontalPost__main-title']}>
                                    <a href={"/detail" + item.detail} title={item.title}
                                       data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem4" data-limit="80">
                                        {item.desc}
                                    </a>
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.sectionTopstory__center}>
                    {centerStory && <div className="group-reverse">
                        <div data-pr="False" data-pin="False"
                             className="verticalPost version-news sm:lineSeparates topStory">
                            <div className={styles.verticalPost__avt}>
                                <a href={"/detail" + centerStory.url} title={centerStory.content}
                                   data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem3">
                                    <picture>
                                        <source srcSet={centerStory.img} media="(max-width: 1023px)"/>
                                        <img data-original={centerStory.content} src={centerStory.img}
                                             alt={centerStory.content}/>
                                    </picture>
                                </a>
                            </div>
                            <div className={styles.verticalPost__main}>
                                <h2 className={styles['verticalPost__main-title'] + " vnn-title"} data-id="2287426">
                                    <a href={"/detail" + centerStory.url} title={centerStory.content}
                                       data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem3">
                                        {centerStory.content}
                                    </a>
                                </h2>
                                <div
                                    className={styles['verticalPost__main-desc'] + " font-noto"}>{centerStory.desc}</div>
                            </div>
                        </div>
                    </div>}
                    <div className={styles.topStory_3nd}>
                        {top3Story.map((item, index) => (
                            <div data-pr="False" data-pin="False"
                                 className={styles.verticalPost + " version-news sm:lineSeparates"}>
                                <div className={styles.verticalPost__avt}>
                                    <a href={"/detail" + item.url} title={item.content}
                                       data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem2">
                                        <picture>
                                            <source srcSet={item.img} media="(max-width: 1023px)"/>
                                            <img data-original={item.content} src={item.img} alt={item.content}/>
                                        </picture>
                                    </a>
                                </div>
                                <div className={styles.verticalPost__main}>
                                    <h3 data-id="2288775">
                                        <a href={"/detail" + item.url} title={item.content}
                                           data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem2">
                                            {item.content}
                                        </a>
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
                        <RSSFeed feedUrl={feeds.thoi_su} title="Thời Sự"/>
                        <RSSFeed feedUrl={feeds.the_thao} title="Thể Thao"/>
                    </div>
                    <div>
                        <div className={styles.group2}>
                            <RSSFeed feedUrl={feeds.chinh_tri} title="Chính Trị"/>
                            <RSSFeed feedUrl={feeds.su_kien} title="Sự Kiện"/>
                            <RSSFeed feedUrl={feeds.tuan_viet_nam} title="Tuần Việt Nam"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;