
import styles from "./nav.module.css"
import {FaHome} from "react-icons/fa";
import React from "react";
function Nav() {
    return (
        <div className={styles.wrapNav} >
            <nav className={styles.mainNav} >
                <ul className={styles.mainNav__list} >
                    <li className={styles['mainNav__list-item']} >
                        <a class="btn-home" href="/" title="VietNamNet" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            <span class="icon-home"><FaHome/></span>
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/chinh-tri">
                        <a title="Chính trị" href="/chinh-tri" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Chính trị
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/thoi-su">
                        <a title="Thời sự" href="/thoi-su" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Thời sự
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/kinh-doanh">
                        <a title="Kinh doanh" href="/kinh-doanh" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Kinh doanh
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/the-thao">
                        <a title="Thể thao" href="/the-thao" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Thể thao
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/the-gioi">
                        <a title="Thế giới" href="/the-gioi" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Thế giới
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/giao-duc">
                        <a title="Giáo dục" href="/giao-duc" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Giáo dục
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/giai-tri">
                        <a title="Giải trí" href="/giai-tri" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Giải trí
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/van-hoa">
                        <a title="Văn hóa" href="/van-hoa" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Văn hóa
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/tuan-viet-nam" >
                        <a title="Tuần Việt Nam" href="/tuan-viet-nam" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Tuần Việt Nam
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/doi-song">
                        <a title="Đời sống" href="/doi-song" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Đời sống
                        </a>
                    </li>
                    <li className={styles['mainNav__list-item']}  routeractive="/suc-khoe">
                        <a title="Sức khỏe" href="/suc-khoe" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=menu-top">
                            Sức khỏe
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default Nav;