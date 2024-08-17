import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './home/Home';
import Main from './main';
// import Test from './home/Test';
import Category from './category/category';
import Login from "./login/Login";
import Register from "./login/Register";
import Detail from "./detail/detail";
import SearchPage from './searchpage/search';
import History from './history/history';
import Contact from "./contact/Contact";
import ManaInfo from "./manageInfo/ManaInfo";
import Blog from './admin/blog/Blog';
import UserList from "./login/UserList";
import Unauthorized from "./login/Unauthorized";
import ContactManager from "./admin/ContactManager/ContactManager";

import BlogForm from "./admin/blogDetail/blogDetail";
import CommentManage from "./admin/CommentManager/CommentManage";
import AdminHome from "./admin/AdminHome/AdminHome";
import Dashboard from "./admin/Dashboard/Dashboard";
function RouterConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/:category' element={<Category/>}></Route>
                    <Route path='/:category/:subcategory' element={<Category/>}></Route>
                    <Route path='/detail/:id' element={<Detail/>}></Route>
                    <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}></Route>
                    <Route path='/history' element={<History/>}></Route>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>} />
                    <Route path='/contact' element={<Contact/>}/>
                    <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}/>
                    <Route path='/manaInfo' element={<ManaInfo/>}/>
                    <Route path='/admin/blogs' element={<Blog/>}/>
                    <Route path='/admin/blogDetail' element={<BlogForm/>}/>
                    <Route path='/admin/blogDetail/:blogId' element={<BlogForm/>}/>
                    <Route path='/admin/contactManager' element={<ContactManager/>}/>
                    <Route path='/admin/commentManager' element={<CommentManage/>}/>
                </Route>
                {/* <Route path='/test' element={<Test/>}/> */}
                <Route path='/admin' element={<AdminHome/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path='blogs' element={<Blog/>}/>
                    <Route path='blogDetail' element={<BlogForm/>}/>
                    <Route path='blogDetail/:blogId' element={<BlogForm/>}/>
                    <Route path='contactManager' element={<ContactManager/>}/>
                    <Route path="/users" element={<UserList/>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default RouterConfig;
