import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import SchedulePage from "./components/Main/SchedulePage";
import MyPage from "./components/Main/MyPage";
import FlashRunMake from "./components/FlashRun/FlashRunMake";
import FlashRunDetail from "./components/FlashRun/FlashRunDetail";
import LoginPage from "./components/Login/LoginPage";
import StudentidInput from "./components/createAccount/StudentidInput";
import PasswordInput from "./components/createAccount/PasswordInput";
import NameInput from "./components/createAccount/NameInput";
import SchoolInputInfo from "./components/createAccount/SchoolInfoInput";
import TelNumberInput from "./components/createAccount/TelNumberInput";
import FlashRunList from "./components/FlashRun/FlashRunList";
import TabNavigationUI from "./components/TabNavigationUI";


import NewMain from "./components/MainPage/NewMain";
import AdminPage from "./components/AdminPage/AdminPage";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import NewFlashRunList from "./components/NewFlashRun/NewFlashRunList";
import PastRuns from "./components/NewFlashRun/PastRuns";


import ProtectedRoute from './components/ProtectedRoute';
import NewRegularRunList from './components/NewRegularRun/NewRegularRunList';
import NewRegularRunMake from './components/NewRegularRun/NewRegularRunMake';
import EventMake from './components/NewEvent/EventMake'
import TrainingMake from './components/NewTraining/TrainingMake';
import NewEventCard from './components/NewFlashRun/NewEventCard';
import NewTrainingList from './components/NewTraining/NewTrainingList';
import NewEventList from './components/NewEvent/NewEventList';
import Sandbox from './components/Sandbox';
import NewRegularRunDetail from './components/NewRegularRun/NewRegularRunDetail';
import NewTrainingDetail from './components/NewTraining/NewTrainingDetail';
import NewEventDetail from './components/NewEvent/NewEventDetail';

import NewRegularRunEdit from './components/NewRegularRun/NewRegularRunEdit';
import NewTrainingEdit from './components/NewTraining/NewTrainingEdit';
import NewFlashRunEdit from './components/FlashRun/NewFlashRunEdit';
import EventEdit from './components/NewEvent/EventEdit';

import ProfileFixPage from "./components/Main/ProfileFixPage";
import RecordOutPage from "./RecordOutPage";
import RecordOutPage2 from "./RecordOutPage2";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-w-{375px} max-w-full">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/student-id" element={<StudentidInput />} />
            <Route path="/password-input" element={<PasswordInput />} />
            <Route path="/name-input" element={<NameInput />} />
            <Route path="/school-info" element={<SchoolInputInfo />} />
            <Route path="/telNum-input" element={<TelNumberInput />} />

            {/* ProtectedRoute 내부에 들어 있는 Route들은 로그인 안됐는데 url로 이동하지 못하도록 막아놓은 것임 (보안용) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/schedule-page" element={<SchedulePage />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/run" element={<FlashRunList />} />
              <Route path="/run/flash/:postId" element={<FlashRunDetail />} />
              <Route path="/run/regular/:postId" element={<NewRegularRunDetail />} />
              <Route path="/run/training/:postId" element={<NewTrainingDetail />} />
              <Route path="/run/event/:postId" element={<NewEventDetail />} />
              <Route path="/run/make" element={<FlashRunMake />} />
              <Route path="/tab/*" element={<TabNavigationUI />} />
              <Route path="/main" element={<NewMain />} />
              <Route path="/flashRun" element={<NewFlashRunList />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/regular" element={<NewRegularRunList />} />
              <Route path="/training" element={<NewTrainingList />} />
              <Route path="/regular/make" element={<NewRegularRunMake />} />
              <Route path="/event/make" element={<EventMake />} />
              <Route path="/training/make" element={<TrainingMake />} />
              <Route path="/event" element={<NewEventList />} />
              
              <Route path="/regular/edit/:postId" element={<NewRegularRunEdit/>} />
              <Route path="/training/edit/:postId" element={<NewTrainingEdit/>} />
              <Route path="/flash/edit/:postId" element={<NewFlashRunEdit/>} />
              <Route path="/event/edit/:postId" element={<EventEdit/>} />
              <Route path="/profilefix-page" element={<ProfileFixPage />} />

              {/* 컴포넌트 테스트 sandbox */}
              <Route path="/sandbox" element={<RecordOutPage />} />
              <Route path="/sandbox2" element={<RecordOutPage2 />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
