import React, {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";

//Icon들 import
import rikuLogo_text from '../assets/navi-icon/rikuLogo_text.svg'; //라이쿠 로고(왼쪽) 불러오기
import rikuLogo_picture from '../assets/navi-icon/rikuLogo_picture.svg'; //라이쿠 로고(왼쪽) 불러오기

const ActionBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center w-full h-16 border-t-[1.5px] z-[1000] border-kuDarkGreen bg-kuDarkGreen">
      {/* 상단 액션 바(TabNavigationUI에서 하단의 NavBar와 함께 계속 떠있을 것임) */}
      {/* 아이콘 2개를 양쪽에 정렬한다 */}
      <img src={rikuLogo_text} alt="Riku_Logo" className="ml-8 w-auto h-auto"/> {/* 원본 크기 유지 */}
      <img src={rikuLogo_picture} alt="Riku_Logo" className="mr-8 w-auto h-auto"/> {/* 원본 크기 유지 */}
    </div>
  );
};

export default ActionBar;