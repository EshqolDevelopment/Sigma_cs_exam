import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Upload from "./Upload";
import App from './App';
import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(

    <BrowserRouter>
        <Routes>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="*" element={<App/>}/>
        </Routes>
    </BrowserRouter>
)