//공지사항 세부 내용을 확인하는 화면
import React, { useState } from "react";

import BacbBtnimg from "../../assets/BackBtn.svg";
import { useNavigate } from "react-router-dom";
import ActionBarDetail from "../ActionBarDetail";

const NoticeDetail = () => {
  const navigate = useNavigate(); //다른 화면으로 이동하기 위한 navigate 함수

  const [showOverlay, setShowOverlay] = useState(false); //액션 바의 ... 버튼 클릭 시, 회색 배경을 보여줄 지의 여부
  const [isWriter, setIsWriter] = useState(false); //작성자인지 아닌지 확인하는 state

  return (
    <>
      <ActionBarDetail barName="공지사항" isOptionBtnNeeded={false} />
      <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-20 p-4 pb-20 animate-fade-in"></div>
    </>
  );
};

export default NoticeDetail;
