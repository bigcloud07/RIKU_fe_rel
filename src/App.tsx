import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SchedulePage from './components/Main/SchedulePage';
import MyPage from './components/Main/MyPage';
import FlashRunMake from './components/FlashRun/FlashRunMake';
import FlashRunDetail from './components/FlashRun/FlashRunDetail';
import LoginPage from './components/Login/LoginPage';
import StudentidInput from './components/createAccount/StudentidInput';
import PasswordInput from './components/createAccount/PasswordInput';
import NameInput from './components/createAccount/NameInput';
import SchoolInputInfo from './components/createAccount/SchoolInfoInput';
import TelNumberInput from './components/createAccount/TelNumberInput';
import FlashRunList from './components/FlashRun/FlashRunList';
import TabNavigationUI from './components/TabNavigationUI';

import NewMain from './components/MainPage/NewMain'
import NewFlashRunCard from "./components/NewFlashRun/NewEventCard"
import AdminPage from './components/AdminPage/AdminPage';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import NewFlashRunList from './components/NewFlashRun/NewFlashRunList';
import PastRuns from './components/NewFlashRun/PastRuns';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="max-w-{375px}">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/student-id" element={<StudentidInput />} />
            <Route path="/password-input" element={<PasswordInput />} /> 
            <Route path='/name-input' element={<NameInput />} />
            <Route path='/school-info' element={<SchoolInputInfo />} />
            <Route path='/telNum-input' element={<TelNumberInput />} />
            {/* 로그인 후 사용해야 할 페이지들에 대해서는 로그인 상태여야 접근 가능하도록 ProtectedRoute로 감싸야 한다 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/run" element={<FlashRunList />} />
              <Route path="/run/post/:postId" element={<FlashRunDetail />} />
              <Route path="/run/make" element={<FlashRunMake />} />
              <Route path='/tab/*' element={<TabNavigationUI/>} />
              <Route path='/flashRuntest' element={<NewFlashRunList/>} />
              {/* <Route path='/flashRuncard' element={<NewFlashRunCard/>} /> */}
              <Route path='/pastruns' element={<PastRuns/>} />
              <Route path='/admin' element={<AdminPage/>}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
