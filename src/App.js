import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import TabNavigation from './components/TabNavigation';
import Home from './pages/Home';
import DetailPage from './pages/Home/DetailPage';
import MyPage from './pages/Home/MyPage';
import SearchPage from './pages/Home/SearchPage';
import ReviewWritePage from './pages/Review/ReviewWritePage';
import ReviewMainPage from './pages/Review/ReviewMainPage';
import MyWishlistPage from './pages/MyPage/MyWishlistPage';
import MyReviewPage from './pages/MyPage/MyReviewPage';
import MyVisitSchedule from './pages/MyPage/MyVisitSchedule';
import InformationPage from './pages/InformationPage';
import VisitSchedulePage from './pages/VisitSchedulePage';
import InsertPlacePage from './pages/InsertPlacePage';

function AppInner() {
  const location = useLocation();
  const HIDE_TABS = ['/mywishlist'];
  const showTabs = !HIDE_TABS.some((p) => location.pathname.startsWith(p));

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:externalISd" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/review/write" element={<ReviewWritePage />} />
        <Route path="/reviewmain" element={<ReviewMainPage />} />
        <Route path="/mywishlist" element={<MyWishlistPage />} />
        <Route path="/myreview" element={<MyReviewPage />} />
        <Route path="/myvisit" element={<MyVisitSchedule />} />
        <Route path="/information/:externalId" element={<InformationPage />} />
        <Route path="/insertplace" element={<InsertPlacePage />} />
        <Route path="/visitschedule" element={<VisitSchedulePage />} />        
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
