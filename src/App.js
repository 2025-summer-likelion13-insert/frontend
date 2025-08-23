import logo from './logo.svg';
import './App.css';
import VisitSchedulePage from "./pages/VisitSchedulePage";
import InformationPage from "./pages/InformationPage";
import RecommendPage from "./pages/RecommendPage";
import InsertPlacePage from "./pages/InsertPlacePage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <Route path="/" element={<InsertPlacePage  />} />
        <Route path="/Recommendpage" element={<RecommendPage  />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
