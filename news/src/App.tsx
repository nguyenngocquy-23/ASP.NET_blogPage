import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import RouterConfig from './components/router';
import ScrollToTopButton from "./components/OnTop";
import {useDispatch} from "react-redux";
import axios from "axios";
import {loginCurrentUser, logoutCurrentUser} from "./components/reduxStore/UserSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await axios.get(`https://localhost:7125/User/getUserFromToken`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                const { id, username, fullName, email, phoneNumber, role, status } = response.data;
                const userData = { id, username, fullName, email, phoneNumber, role, status };
                dispatch(loginCurrentUser(userData));
            } catch (err) {
                dispatch(logoutCurrentUser());
            }
        };
        checkAuthorization();
    }, [dispatch]);
    return (
    <div className="App">
        <RouterConfig></RouterConfig>
        <ScrollToTopButton />
    </div>
  );
}

export default App;
