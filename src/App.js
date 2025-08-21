import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import TabNavigation from './components/TabNavigation';
import Home from './pages/Home';
import DetailPage from './pages/Home/DetailPage';
import MyPage from './pages/Home/MyPage';
import SearchPage from './pages/Home/SearchPage';
import ReviewWritePage from './pages/Review/ReviewWritePage';
import MyWishlistPage from './pages/MyPage/MyWishlistPage';
import InformationPage from './pages/InformationPage';

function AppInner() {
  const location = useLocation();
  const HIDE_TABS = ['/mywishlist'];
  const showTabs = !HIDE_TABS.some((p) => location.pathname.startsWith(p));

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/review/write" element={<ReviewWritePage />} />
        <Route path="/mywishlist" element={<MyWishlistPage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>

      {showTabs && <TabNavigation />}
    </>
  );
}

// BrowserRouter는 최상위에서 한 번만 감싸줌
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
