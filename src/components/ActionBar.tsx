import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//Icon들 import
import rikuLogo_text from "../assets/navi-icon/rikuLogo_text.svg"; //라이쿠 로고(왼쪽) 불러오기
import rikuLogo_picture from "../assets/navi-icon/rikuLogo_picture.svg"; //라이쿠 로고(왼쪽) 불러오기

const ActionBar: React.FC = () => {
  const navigate = useNavigate();
  const handleMain = () => navigate("/main");

  return (
    <div className="fixed top-0 inset-x-0 mx-auto flex justify-between items-center max-w-[430px] w-full h-[56px] border-t-[1.5px] z-[1000] border-kuDarkGreen bg-kuDarkGreen">
      
      
      <div onClick={handleMain} className="cursor-pointer">
        <object
          data={rikuLogo_text}
          className="ml-8 w-auto h-auto pointer-events-none"
        />{" "}
      </div>

      
      <div onClick={handleMain} className="cursor-pointer">
        <object
          data={rikuLogo_picture}
          className="mr-8 w-auto h-aut pointer-events-none"
          onClick={handleMain}
        />{" "}
      </div>

      
    </div>
  );
};

export default ActionBar;
