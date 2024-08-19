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
import ContactManager from "./admin/ContactManager/ContactManager";

import BlogForm from "./admin/blogDetail/BlogDetail";
import CommentManage from "./admin/CommentManager/CommentManage";
import AdminHome from "./admin/AdminHome/AdminHome";
import Dashboard from "./admin/Dashboard/Dashboard";
import Unauthorized from "./admin/users/Unauthorized";
import UserList from "./admin/users/UserList";
import ManagerCategory from "./admin/categroryManager/CategoryManager";
import AdminRegister from "./admin/users/AdminRegister";
function RouterConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/:category' element={<Category/>}/>
                    <Route path='/:category/:subcategory' element={<Category/>}/>
                    <Route path='/detail/:id' element={<Detail/>}/>
                    <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}/>
                    <Route path='/history' element={<History/>}></Route>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>} />
                    <Route path='/contact' element={<Contact/>}/>
                    <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}/>
                    <Route path='/manaInfo' element={<ManaInfo/>}/>
                </Route>
                <Route path='/admin' element={<AdminHome/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path='blogs' element={<Blog/>}/>
                    <Route path='blogDetail' element={<BlogForm/>}/>
                    <Route path='blogDetail/:blogId' element={<BlogForm/>}/>
                    <Route path='contactManager' element={<ContactManager/>}/>
                    <Route path='commentManage' element={<CommentManage/>}/>
                    <Route path="users" element={<UserList/>} />
                    <Route path="category" element={<ManagerCategory/>}/>
                    <Route path="adminCreate" element={<AdminRegister/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default RouterConfig;
