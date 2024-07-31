import categoryStyles from '../category/category.module.css'
import {BrowserRouter as Router, Routes, Route, useParams, Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
// import fetchHtml from './loadDOM'
import axios from 'axios';
import fetchHTML from '../home/loadDOM';
import {Cheerio} from 'cheerio';
import useEffectOnce from '../useEffectOne';
import {useHistory, useLocation} from 'react-router-dom';
import SpeechRecognitionComponent from '../voice/voice';
import {useSelector} from 'react-redux';
import store from '../reduxStore/Store';
import {createSelector} from '@reduxjs/toolkit';
import styles from "../contact/Contact.module.css";
import {FaVideo} from "react-icons/fa";

const cheerio = require('cheerio');

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const selectUserState = (state) => state.user;

export const selectReadArticles = createSelector(
    [selectUserState],
    (userState) => userState.readArticles
);

function History() {

    const top15Story = useSelector(selectReadArticles);
    const reversedTop15Story = [...top15Story].reverse();

    return (
        <div style={{margin: 0 + " " + 100 + "px"}} className={categoryStyles['topStory-15nd']}>
            <h1 className={categoryStyles.title}>CÁC BÀI ĐÃ XEM GẦN ĐÂY</h1>
            {reversedTop15Story.map((item, index) => (
                <div className={` ${categoryStyles.horizontalPost} ${categoryStyles['version-news']} ${'mb-20'}  `}>
                    <div className={` ${categoryStyles['horizontalPost__avt']} ${categoryStyles['avt-240']} `}>
                        <a href={"/detail" + item.url} title={item.title}
                           data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1">
                            <picture>
                                <source data-srcset={item.img} media="(max-width: 767px)" srcset={item.img}/>
                                <source data-srcset={item.img} media="(max-width: 1023px)" srcset={item.img}/>
                                {item.img ? (
                                    <img src={item.img} class=" lazy-loaded" data-srcset={item.img} alt={item.title}
                                         srcset={item.img}/>
                                ) : (
                                    <FaVideo style={{fontSize: '70px', margin: '30px 85px'}}/>
                                )}
                            </picture>
                        </a>
                    </div>
                    <div className={categoryStyles['horizontalPost__main']}>
                        <h3 className={` ${categoryStyles['horizontalPost__main-title']} ${categoryStyles['vnn-title']} ${categoryStyles['title-bold']} `}
                            data-id="2291894" ispr="False">
                            <a href={"/detail" + item.url} title={item.title}
                               data-utm-source="#vnn_source=bongdavietnam&amp;vnn_medium=listtin1" data-limit="">
                                {item.title}
                            </a>
                        </h3>
                        <div className={categoryStyles['horizontalPost__main-desc']} data-limit="">
                            <p>{item.content}</p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default History;

<a style={{width: '120px', height: '100px'}}>
    <img></img>
</a>