import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Upload from "./NewQuestion/Upload";
import Profile from "./Profile/Profile";
import CreateExam from "./CreateExam/CreateExam";
import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(

    <BrowserRouter>
        <Routes>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/create-exam" element={<CreateExam/>}/>
            <Route path="*" element={<Profile/>}/>
        </Routes>
    </BrowserRouter>
)