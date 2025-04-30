// 올라온 공지사항을 모두 확인 가능한 페이지
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionBarDetail from "../ActionBarDetail";
import profile_Img from "../../assets/default_profile.png";

//공지들에 들어가는 요소들
interface SimpleNotice {
  date: string;
  title: string;
  userProfileImgUrl: string | null;
  userName: string;
}

const NoticeMain = () => {
  const navigate = useNavigate(); //다른 화면으로 이동하기 위한 navigate 함수

  const [isCanWrite, setIsCanWrite] = useState<boolean>(false); //"글쓰기" 권한이 있는지 확인
  const [notices, setNotices] = useState<SimpleNotice[]>([
    {
      date: "2025.01.20",
      title: "허주노 선릉 출근 시작......",
      userProfileImgUrl: null,
      userName: "허기철",
    },
    {
      date: "2025.03.18",
      title: "허주노 선릉 출근",
      userProfileImgUrl: null,
      userName: "허기영",
    },
    {
      date: "2025.04.28",
      title: "허주노 정규런 복귀",
      userProfileImgUrl: null,
      userName: "이희선",
    },
  ]);

  const handleToWritingPage = () => {
    //공지 글쓰기 페이지로 이동하는 함수
    navigate("/notice/write");
  };

  return (
    <div className="h-screen flex flex-col">
      <ActionBarDetail barName="공지사항" isOptionBtnNeeded={false} />
      <div className="flex flex-col w-full pt-6 px-6 bg-kuGray flex-1">
        {/* 상단에 '공지사항'이랑 '글쓰기' 버튼 있는 곳 */}
        <div className="flex justify-between w-full text-left mb-4">
          <span className="text-2xl font-normal pl-1">공지사항</span>
          {/* 글쓰기 버튼(작성 권한 있는 사람만 보이기)*/}
          {isCanWrite ? (
            <button
              className={`mb-2 py-1 px-6 bg-kuDarkGreen hover:bg-kuGreen text-white font-bold rounded-xl transition-colors`}
              onClick={handleToWritingPage}
            >
              글쓰기
            </button>
          ) : null}
        </div>
        {notices.map((notice, index) => (
          <div
            key={index}
            className="flex flex-col p-4 items-start justify-center bg-kuWhite my-1.5 rounded-xl gap-1"
          >
            <span className="text-xs font-light text-kuDarkGray">{notice.date}</span>
            <span className="text-lg font-semibold text-kuBlack">{notice.title}</span>
            {/*유저명과 프로필사진이 나올 곳*/}
            <div className="flex flex-row gap-2 items-center">
              <img
                src={notice.userProfileImgUrl || profile_Img}
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-semibold text-kuDarkGray">{notice.userName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeMain;
