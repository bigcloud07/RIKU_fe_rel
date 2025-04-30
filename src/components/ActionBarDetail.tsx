//네비게이션 바로 이동하는 화면이 아닌 다른 화면에서 사용할 액션 바
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BacbBtnimg from "../assets/BackBtn.svg";

interface ActionBarDetailProps {
  barName: string;
  isOptionBtnNeeded: boolean; //'...'(더보기) 버튼 필요 유무
  onOptionToggle?: (open: boolean) => void; //isOptionBtnNeeded가 true일 경우 넘어올 함수임
}

const ActionBarDetail = ({ barName, isOptionBtnNeeded, onOptionToggle }: ActionBarDetailProps) => {
  const navigate = useNavigate(); //useNavigate 훅을 활용해서 navigate 함수를 얻는다
  const dotButtonRef = useRef<HTMLDivElement>(null);

  const handleGoBack = () => {
    //한 단계 뒤로 이동하는 메소드 (history가 없는 경우엔 main으로 이동)
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/tab/main");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 상단바 */}
      <div className="relative flex bg-kuDarkGreen w-full max-w-[430px] h-[56px] text-white text-xl font-semibold justify-center items-center">
        <img
          src={BacbBtnimg}
          className="absolute left-[24px] cursor-pointer"
          alt="Back"
          onClick={handleGoBack}
        />
        {barName}
        {isOptionBtnNeeded ? (
          <div
            ref={dotButtonRef}
            className="absolute right-[5px] top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
            }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-y-[4px]">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="w-[4px] h-[4px] bg-white rounded-full" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ActionBarDetail;
