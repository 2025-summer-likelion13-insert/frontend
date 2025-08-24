import logo from './logo.svg';
import './App.css';
import VisitSchedulePage from "./pages/VisitSchedulePage";
import InformationPage from "./pages/InformationPage";
import RecommendPage from "./pages/RecommendPage";
import InsertPlacePage from "./pages/InsertPlacePage";
import LoginPage from './pages/Login/LoginPage';
import NameSettingPage from './pages/Login/NameSettingPage'
import WelcomePage from './pages/Login/WelcomePage';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileSettingPage from './pages/ProfileSettingPage';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage  />} />
        <Route path="/Recommendpage" element={<RecommendPage  />} />
        <Route path="/InsertPlacePage" element={<InsertPlacePage  />} />
        <Route path="/NameSettingPage" element={<NameSettingPage  />} />
        <Route path="/WelcomePage" element={<WelcomePage  />} />
        <Route path="/ProfileSettingPage" element={<ProfileSettingPage  />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
