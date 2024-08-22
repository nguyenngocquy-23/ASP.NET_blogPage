import React, {useEffect, useState} from 'react';
import {IoFootstepsSharp} from "react-icons/io5";
import  './AuthorStyle.css'
import axios from "axios";
import PropTypes from "prop-types";
import {formatRelativeTime} from "../utils/dateUtils";


AuthorProfile.propTypes = {
    userId: PropTypes.string.isRequired,
};

function AuthorProfile({authorId}) {

    // authProfile sẽ nhận vào response trả về từ API.
    const [authProfile, setAuthProfile] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:7125/User/profile/${authorId}`)
            .then(response => setAuthProfile(response.data))
            .catch(error => console.error("Error fetching author profile:", error));
    }, [authorId]);


        if(!authProfile) return <div>Loading...</div>

    return (
        <div className="card-profiles">
            <div className="card-header">
                <div className="pic">
                    <img
                        src="https://i.pinimg.com/564x/70/e4/ea/70e4ea4af5c79a543e3e79b1d67e1205.jpg"
                        alt="Profile"
                    />
                </div>
                <div className="name">{authProfile.fullName}</div>
                <div className="desc">Người viết bài</div>
                <div className="location">
                    <IoFootstepsSharp/> {formatRelativeTime(authProfile.createdAt)}
                </div>
                <a href="#" className="contact-btn">
                   Ủng hộ tác giả !
                </a>
            </div>
            <div className="card-footer">
                <div className="numbers">
                    <div className="item">
                        <span>{authProfile.totalArticles}</span>
                        Bài viết
                    </div>
                    <div className="border"></div>
                    <div className="item">
                        <span>{authProfile.totalLikes}</span>
                        Lượt thích
                    </div>
                    <div className="border"></div>
                    <div className="item">
                        <span>{authProfile.countComments}</span>
                        Phản hồi
                    </div>
                </div>
                <div className="instagram-account">{authProfile.email}</div>
            </div>
        </div>
    );
}

export default AuthorProfile;