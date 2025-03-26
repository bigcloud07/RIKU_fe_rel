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
import NewFlashRunDetail from './components/NewFlashRun/NewFlashRunDetail'
import AdminPage from './components/AdminPage/AdminPage';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import NewFlashRunList from './components/NewFlashRun/NewFlashRunList';
import PastRuns from './components/NewFlashRun/PastRuns';

import ProtectedRoute from './components/ProtectedRoute';
import NewRegularRunList from './components/NewRegularRun/NewRegularRunList';
import NewRegularRunMake from './components/NewRegularRun/NewRegularRunMake';
import EventMake from './components/NewEvent/EventMake'
import TrainingMake from './components/NewTraining/TrainingMake';
import NewEventCard from './components/NewFlashRun/NewEventCard';
import NewTrainingList from './components/NewTraining/NewTrainingRunList';


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
            <Route path='/schedule-page' element={<SchedulePage />} />
            <Route path='/my-page' element={<MyPage />} />
            <Route path="/run" element={<FlashRunList />} />
            <Route path="/run/post/:postId" element={<FlashRunDetail />} />
            <Route path="/run/make" element={<FlashRunMake />} />
            <Route path='/tab/*' element={<TabNavigationUI/>} />
            <Route path='/main' element={<NewMain/>}/>
            <Route path='/flashRun' element={<NewFlashRunList/>} />
            <Route path='/flashRunAdmintest' element={<NewFlashRunDetail/>}/>
            <Route path='/pastruns' element={<PastRuns/>} />
            <Route path='/admin' element={<AdminPage/>}/>
            <Route path='/regular' element={<NewRegularRunList/>}/>
            <Route path='/training' element={<NewTrainingList/>}/>
            <Route path='/regular/make' element={<NewRegularRunMake/>}/>
            <Route path='/event' element={<EventMake/>}/>
            <Route path='/training/make' element={<TrainingMake/>}/>
            
            
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
