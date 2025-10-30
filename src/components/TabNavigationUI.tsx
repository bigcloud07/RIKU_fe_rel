import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import MyPage from "./Main/MyPage";
import SchedulePage from "./Main/SchedulePage";
import RankingPage from "./Main/RankingPage";
import NewMain from "./MainPage/NewMain";
import ActionBar from "../components/ActionBar";

function TabNavigationUI() {
  return (
    <div>
      <ActionBar />
      <Routes>
        <Route path="/main" element={<NewMain />} />
        <Route path="/schedule-page" element={<SchedulePage />} />
        <Route path="/ranking-page" element={<RankingPage />} />
        <Route path="/my-page" element={<MyPage />} />
      </Routes>
      <NavBar />
    </div>
  );
}

export default TabNavigationUI;
