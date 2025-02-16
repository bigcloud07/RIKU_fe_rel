import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import MyPage from './Main/MyPage';
import SchedulePage from './Main/SchedulePage';
import RankingPage from './Main/RankingPage';
import NewMain from './MainPage/NewMain';

//하단의 탭을 이용해서 오고가는 TabNavigationUI
function TabNavigationUI()
{       
    return (
        <div>
            <Routes>
                <Route path='/main' element={<NewMain/>}/>
                <Route path='/schedule-page' element={<SchedulePage/>}/>
                <Route path='/ranking-page' element={<RankingPage/>}/>
                <Route path='/my-page' element={<MyPage/>}/>
            </Routes>
            {/* 하단 네비게이션 */}
            <NavBar/>
        </div>
    )
}   

export default TabNavigationUI;
