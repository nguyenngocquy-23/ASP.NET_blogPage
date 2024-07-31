import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import RouterConfig from './components/router';
import ScrollToTopButton from "./components/OnTop";

function App() {
  return (
    <div className="App">
        <RouterConfig></RouterConfig>
        <ScrollToTopButton />
    </div>
  );
}

export default App;
