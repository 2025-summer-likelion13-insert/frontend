import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TabNavigation from './components/TabNavigation';
import Home from './pages/Home';
import DetailPage from './pages/Home/DetailPage';
import MyPage from './pages/Home/MyPage';
import ReviewWritePage from './pages/Review/ReviewWritePage';
import InformationPage from './pages/InformationPage';


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/review/write" element={<ReviewWritePage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
        <TabNavigation /> 
    </BrowserRouter>
  );
};

export default App;
