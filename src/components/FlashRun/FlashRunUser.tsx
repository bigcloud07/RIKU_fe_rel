import React, { useState, useEffect } from "react";
import FlashRunlogo from "../../assets/FlashRunDetail/flashrunlogo.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import backiconWhite from "../../assets/back-icon-white.svg"
import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg"; // 번개런 기본이미지
import { Link, useNavigate } from "react-router-dom";

interface Participant {
  id: number;
  name: string;
  profileImage?: string | null;
  isPresent: boolean;
}

interface FlashRunUserData {
  title: string;
  location: string;
  date: string;
  participants: Participant[];
  participantsNum: number;
  content: string;
  userName: string;
  code?: string;
  postId?: string; // 게시글 ID
  userStatus?: string; // 유저의 현재 상태 (참여, 출석 등)
  postimgurl?: string;
}

const FlashRunUser: React.FC<FlashRunUserData> = ({
  title,
  location,
  date,
  participants,
  participantsNum,
  content,
  userName,
  postId,
  postimgurl,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [buttonText, setButtonText] = useState(() => {
    // 로컬 스토리지에서 buttonText 초기값 가져옴
    return (
      localStorage.getItem(`buttonText-${postId}`) ||
      (localStorage.getItem(`userStatus-${postId}`) === "ATTENDED"
        ? "출석완료"
        : "참여하기")
    );
  });
  const [code, setCode] = useState(""); // 출석 코드
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(participants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [userStatus, setUserStatus] = useState(() => {
    // 로컬 스토리지에서 userStatus 초기값 가져옴
    return localStorage.getItem(`userStatus-${postId}`) || "";
  });

  // buttonText 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (buttonText) {
      localStorage.setItem(`buttonText-${postId}`, buttonText);
    }
  }, [buttonText, postId]);

  // userStatus 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (userStatus) {
      localStorage.setItem(`userStatus-${postId}`, userStatus);
    }
  }, [userStatus, postId]);

  const handleStartClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(`/run/post/${postId}/join`, {}, {
        headers: {
          Authorization: `${token}`, // 적절한 토큰으로 교체
        },
      });

      if (response.data.isSuccess) {
        setUserStatus(response.data.result.status); // 상태 업데이트
        setButtonText("출석하기");
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error: any) {
      setError("러닝 참여에 실패했습니다.");
    }
  };

  const handleOpenAttendanceModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleAttendanceClick = async () => {
    if (!code) {
      setError("출석 코드를 입력해주세요.");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/post/${postId}/attend`,
        { code },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setUserStatus(response.data.result.status); // 출석 상태로 업데이트
        setButtonText("출석완료"); // 버튼 텍스트를 출석완료로 설정
        setError(null);
        setIsModalOpen(false); // 모달 닫기
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error: any) {
      setError("출석 코드를 다시 확인해주세요.");
    }
  };

  const handleTabChange = async (tab: "소개" | "명단") => { //명단 탭누를때 마다 명단 사람들의 상태 최신화
    setActiveTab(tab);
    if (tab === "명단") {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/post/${postId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data.isSuccess) {
          console.log(response.data)
          setCurrentParticipants(response.data.result.participants); // 최신 참가자 목록 설정
        } else {
          setError(response.data.responseMessage);
        }
      } catch (error: any) {
        setError("참가자 목록을 가져오는 데 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      <div>
        <img src={postimgurl || flashrunimage} alt="flashrunimg" className="w-[373px] mb-2 rounded-b-xl" />
        <img
          src={backiconWhite}
          alt="back-icon"
          className="absolute top-2 left-2 w-6 h-6 cursor-pointer z-10"
          
        />
      </div>
      <div className="flex flex-col items-center mt-2.5">
        <img src={FlashRunlogo} alt="flashrunlogo" />
        <div className="text-lg font-semibold mt-2">{title}</div>
      </div>
      <div className="flex flex-col items-start w-full max-w-[360px] mt-5">
        <div className="flex items-center my-1.5">
          <img src={place} alt="place-icon" className="w-6 h-6 mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center my-1.5">
          <img src={time} alt="time-icon" className="w-6 h-6 mr-2" />
          <span>{date}</span>
        </div>
        <div className="flex items-center my-1.5">
          <img src={people} alt="people-icon" className="w-6 h-6 mr-2" />
          <span>{participantsNum}명 참여 중</span>
        </div>
      </div>
      <TabButton
        leftLabel="소개"
        rightLabel="명단"
        onTabChange={handleTabChange}
      />
      {activeTab === "소개" && (
        <>
          <div className="flex justify-center items-center w-[327px] h-14 bg-[#F0F4DD] rounded-lg text-sm font-normal mt-5">
            <div className="flex items-center">
              <div className="flex justify-center items-center bg-[#B4D34D] w-6 h-6 rounded-full relative mr-2">
                <span className="text-white text-xs font-bold">
                  {userName.charAt(0)}
                </span>
              </div>
              {userName}
            </div>
          </div>
          <div className="mt-5 w-[327px] border border-[#ECEBE4] rounded-lg">
            <div className="text-[#686F75] p-5 text-justify">{content}</div>
          </div>
        </>
      )}
      {activeTab === "명단" && <AttendanceList users={currentParticipants} />}
      <button
        className={`flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mt-20 mb-2 ${userStatus === "ATTENDED"
          ? "bg-[#ECEBE4] text-[#757575] cursor-not-allowed"
          : userStatus === "PENDING"
            ? "bg-kuWarmGray text-white" // PENDING 상태일 때
            : "bg-kuDarkGreen text-white" // 기본 상태 (참여하기)
          }`}
        onClick={
          userStatus !== "PENDING"
            ? handleStartClick
            : handleOpenAttendanceModal
        }
        disabled={userStatus === "ATTENDED"}
      >
        {buttonText}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-5 rounded-lg w-[280px] text-center relative">
            <button
              className="absolute top-2.5 right-2.5 text-2xl cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2>출석 코드를 입력해주세요.</h2>
            <input
              type="text"
              className="w-full p-2 border-b border-gray-300 text-center text-lg mt-5"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="w-full py-3 rounded-lg bg-[#366943] text-white text-lg mt-5"
              onClick={handleAttendanceClick}
            >
              확인
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashRunUser;
