import React, { useState, useEffect } from "react";
import RegularRunlogo from "../../assets/regularRunMark.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg";
import { useNavigate } from "react-router-dom";
import BackBtnimg from "../../assets/BackBtn.svg";
import pacermark from "../../assets/pacer-mark.svg";
import CommentSection from "./CommentSection";
import PacerCard from "./PacerCard";
import questionmarkOn from "../../assets/questionmark_on.svg";
import questionmarkOff from "../../assets/questionmark_off.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Participant {
  id: number;
  name: string;
  profileImage?: string | null;
  isPresent: boolean;
}

interface Pacer {
  group: string;
  pacerName: string;
  distance: string;
  pace: string;
}

interface FlashRunUserData {
  postId?: string;
}

const NewTrainingUser: React.FC<FlashRunUserData> = ({ postId }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/regular");

  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsNum, setParticipantsNum] = useState<number>(0);
  const [pacers, setPacers] = useState<Pacer[]>([]);
  const [userInfo, setUserInfo] = useState<{ userId: number; userName: string; userProfileImg: string }>({
    userId: 0,
    userName: "",
    userProfileImg: "",
  });
  const [userStatus, setUserStatus] = useState(() => {
    return localStorage.getItem(`userStatus-${postId}`) || "";
  });

  const [buttonText, setButtonText] = useState(() => {
    return (
      localStorage.getItem(`buttonText-${postId}`) ||
      (localStorage.getItem(`userStatus-${postId}`) === "ATTENDED"
        ? "출석완료"
        : "참여하기")
    );
  });

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [trainingtype, setTrainingtype] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const getTrainingDescription = (type: string) => {
    switch (type) {
      case 'LSD':
        return (
          <>
            <span className="font-bold">LSD</span>란 Long Slow Distance의 약자로, 장거리 달리기 훈련입니다.
          </>
        );
      // 다른 trainingtype에 대한 설명을 추가할 수 있습니다.
      case '인터벌':
        return (
          <>
            <span className="font-bold">인터벌</span> 훈련 이란 짧은 고강도 러닝과, 휴식 또는 저강도의 회복러닝을 번갈아가며 하는 훈련입니다.
          </>
        );
      case '조깅':
        return (
          <>
            <span className="font-bold">조깅</span>이란 느린 속도로 가볍게 달리는 훈련입니다.
          </>
        );
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/training/post/${postId}`, {
          headers: { Authorization: `${token}` },
        });
        if (response.data.isSuccess) {
          const result = response.data.result;
          console.log(result);
          setTitle(result.title);
          setLocation(result.location);
          setDate(result.date);
          setContent(result.content);
          setPostImageUrl(result.postImageUrl);
          setParticipants(result.participants || []);
          setParticipantsNum(result.participantsNum || 0);
          setPacers(result.pacers || []);
          setAttachmentUrls(result.attachmentUrls || []);
          setUserInfo({
            userId: result.userInfo?.userId || 0,
            userName: result.userInfo?.userName || "",
            userProfileImg: result.userInfo?.userProfileImg || "",
          });
          setTrainingtype(result.trainingType);
        } else {
          setError(response.data.responseMessage);
        }
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };
    fetchPostData();
  }, [postId]);

  useEffect(() => {
    if (buttonText) localStorage.setItem(`buttonText-${postId}`, buttonText);
  }, [buttonText, postId]);

  useEffect(() => {
    if (userStatus) localStorage.setItem(`userStatus-${postId}`, userStatus);
  }, [userStatus, postId]);

  const handleStartClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(`/run/training/post/${postId}/join`, {}, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.isSuccess) {
        setUserStatus(response.data.result.status);
        setButtonText("출석하기");
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("러닝 참여에 실패했습니다.");
    }
  };

  const handleOpenAttendanceModal = () => setIsModalOpen(true);

  const handleAttendanceClick = async () => {
    if (!code) return setError("출석 코드를 입력해주세요.");
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/training/post/${postId}/attend`,
        { code },
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.isSuccess) {
        setUserStatus(response.data.result.status);
        setButtonText("출석완료");
        setError(null);
        setIsModalOpen(false);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("출석 코드를 다시 확인해주세요.");
    }
  };

  const formatDateTime = (iso: string) => {
    const dateObj = new Date(iso);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0"); // 분 추가
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const handleTabChange = (tab: "소개" | "명단") => setActiveTab(tab);

  // 말풍선 외부를 클릭했을 때 숨기기
  const handleOutsideClick = (event: React.MouseEvent) => {
    if (!event.target.closest('.tooltip-container') && isTooltipVisible) {
      setIsTooltipVisible(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-5 justify-center" onClick={handleOutsideClick}>
      <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
        훈련
      </div>

      <div className="relative w-[375px] pb-[90px]">
        <object data={postImageUrl || flashrunimage} className="w-[375px] h-[308px]" />
        <div className="absolute top-[230px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[8px]">
            {/* 상단 전체를 relative로 감싸기 */}
            <div className="relative flex flex-col items-center mt-[4px] w-[375px]">

              {/* trainingtype 박스 */}
              <div className="flex bg-[#FFC002] h-[24px] p-[10px] text-[14px] rounded-[8px] font-bold w-fit items-center">
                {trainingtype}
              </div>

              {/* 물음표 아이콘: 고정된 우측 위치 */}
              <img
                src={isTooltipVisible ? questionmarkOn : questionmarkOff}
                alt="question mark"
                className="absolute top-[-1px] right-[18px] w-[24px] h-[24px] cursor-pointer"
                onClick={() => setIsTooltipVisible(!isTooltipVisible)}
              />

              {/* 툴팁 */}
              {isTooltipVisible && (
                <div className="absolute bottom-[140%] right-[25px] bg-[#F5F5F5] pt-[13.5px] pl-[16px] pr-[16px] pb-[13.5px] rounded-tl-lg rounded-tr-lg rounded-bl-lg w-[186px] text-left text-sm z-10">
                  <div className="text-[#4F3F3F] text-[12px]">
                    {getTrainingDescription(trainingtype)}
                  </div>
                </div>
              )}
            </div>
            <div className="text-lg font-semibold mt-2 text-[24px]">{title}</div>
          </div>
          <div className="flex flex-col items-start w-full max-w-[360px] mt-5">
            <div className="flex items-center my-1.5">
              <object data={place} className="w-[24px] h-[24px] mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center my-1.5">
              <object data={time} className="w-[24px] h-[24px] mr-2" />
              <span>{formatDateTime(date)}</span>

            </div>
            <div className="flex items-center my-1.5">
              <object data={people} className="w-[24px] h-[24px] mr-2" />
              <span className="font-bold text-kuDarkGreen">{participantsNum}</span>
            </div>
          </div>
        </div>
      </div>

      <TabButton leftLabel="소개" rightLabel="명단" onTabChange={handleTabChange} />

      {activeTab === "소개" && (
        <>
          <div className="flex items-start text-left w-full mt-3 my-2 max-w-[349px]">
            <img src={pacermark} />
            <div className="m-1">PACER</div>
          </div>
          <PacerCard pacers={pacers} />
          {attachmentUrls.length > 0 && (
            <div className="mt-5 w-[327px]">
              <div className="text-left text-[16px] mb-2">코스 사진</div>
              <div className="relative">
                <Swiper
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                >
                  {attachmentUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative">
                        <img
                          src={url}
                          alt={`코스 사진 ${index + 1}`}
                          className="rounded-lg w-full h-auto"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}/{attachmentUrls.length}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
          <div className="flex flex-col mt-2 items-start text-left w-full max-w-[327px]">세부 내용</div>
          <div className="mt-5 w-[327px] border border-[#ECEBE4] rounded-lg">
            <div className="text-[#686F75] p-5 text-justify">{content}</div>
          </div>
        </>
      )}

      {activeTab === "명단" && <AttendanceList users={participants} />}

      <CommentSection postId={postId!} userInfo={userInfo} />

      <button
        className={`flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mt-20 mb-2 ${userStatus === "ATTENDED"
          ? "bg-[#ECEBE4] text-[#757575] cursor-not-allowed"
          : userStatus === "PENDING"
            ? "bg-kuDarkGreen text-white"
            : "bg-kuGreen text-white"
          }`}
        onClick={userStatus !== "PENDING" ? handleStartClick : handleOpenAttendanceModal}
        disabled={userStatus === "ATTENDED"}
      >
        {buttonText}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-5 rounded-lg w-[280px] text-center relative">
            <button className="absolute top-2.5 right-2.5 text-2xl cursor-pointer" onClick={() => setIsModalOpen(false)}>
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

export default NewTrainingUser;
