import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './home/Home';
import Main from './main';
import Test from './home/Test';
import Category from './category/category';
import Login from "./login/Login";
import Register from "./login/Register";
import Detail from "./detail/detail";
import SearchPage from './searchpage/search';
import History from './history/history';
import Contact from "./contact/Contact";
import ManaInfo from "./manageInfo/ManaInfo";
import BlogForm from "./admin/blogDetail/BlogDetail";

function RouterConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/:category' element={<Category/>}></Route>
                    <Route path='/:category/:subcategory' element={<Category/>}></Route>
                    <Route path='/detail/:link' element={<Detail/>}></Route>
                    <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}></Route>
                    <Route path='/history' element={<History/>}></Route>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/contact' element={<Contact/>}/>
                    <Route path='/manaInfo' element={<ManaInfo/>}/>
                    <Route path='/admin/blogDetail' element={<BlogForm/>}/>
                </Route>
                <Route path='/test' element={<Test/>}/>
                <Route path='/searchPage/:tim-kiem' element={<SearchPage/>}/>
            </Routes>
        </Router>
    );
}

export default RouterConfig;
