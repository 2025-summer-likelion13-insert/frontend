
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

import VisitSchedulePage from "./pages/VisitSchedulePage";
import InformationPage from "./pages/InformationPage";
import RecommendPage from "./pages/RecommendPage";
import InsertPlacePage from "./pages/InsertPlacePage";
import LoginPage from './pages/Login/LoginPage';
import NameSettingPage from './pages/Login/NameSettingPage'
import WelcomePage from './pages/Login/WelcomePage';
import ProfileSettingPage from './pages/ProfileSettingPage';


  return (

    

    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
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

        <Route path="/" element={<LoginPage  />} />
        <Route path="/Recommendpage" element={<RecommendPage  />} />
        <Route path="/InsertPlacePage" element={<InsertPlacePage  />} />
        <Route path="/NameSettingPage" element={<NameSettingPage  />} />
        <Route path="/WelcomePage" element={<WelcomePage  />} />
        <Route path="/ProfileSettingPage" element={<ProfileSettingPage  />} />
        <Route path="/VisitSchedulePage" element={<VisitSchedulePage  />} />

      </Routes>
      <TabNavigation />
    </BrowserRouter>

  );
};

export default App;
