import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Upload from "./NewQuestion/Upload";
import App from './App';
import Profile from "./Profile/Profile";
import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(

    <BrowserRouter>
        <Routes>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*" element={<App/>}/>
        </Routes>
    </BrowserRouter>
)