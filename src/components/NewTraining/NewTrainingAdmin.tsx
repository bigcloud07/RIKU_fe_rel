import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from "../../apis/customAxios";

import RegularRunlogo from "../../assets/regularRunMark.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import BackBtnimg from "../../assets/BackBtn.svg";
import pacermark from "../../assets/pacer-mark.svg";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg";

import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import PacerCard from "./PacerCard";
import CommentSection from "./CommentSection";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import questionmarkOn from "../../assets/questionmark_on.svg";
import questionmarkOff from "../../assets/questionmark_off.svg";

interface Participant {
  userId: number;
  userName: string;
  userProfileImg?: string;
  status: string;
}

interface Pacer {
  group: string;
  pacerName: string;
  distance: string;
  pace: string;
  profileImg?: string | null;
}

interface Props {
  postId?: string;
}

const NewTrainingAdmin: React.FC<Props> = ({ postId }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/regular");

  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsNum, setParticipantsNum] = useState<number>(0);
  const [pacers, setPacers] = useState<Pacer[]>([]);
  const [postCreatorName, setPostCreatorName] = useState("");
  const [buttonText, setButtonText] = useState("시작하기");

  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [trainingtype, setTrainingtype] = useState("");

  const [userInfo, setUserInfo] = useState<{ userId: number; userName: string }>({
    userId: 0,
    userName: "",
  });
  const [trainingType, setTrainingType] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/training/post/${postId}`, {
          headers: { Authorization: `${token}` },
        });
        if (response.data.isSuccess) {
          const result = response.data.result;
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
          });
          setPostCreatorName(result.postCreatorInfo?.userName || "");
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

  const formatDateTime = (iso: string) => {
    const dateObj = new Date(iso);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    return `${month}월 ${day}일 ${hours}시`;
  };

  const handleTabChange = (tab: "소개" | "명단") => setActiveTab(tab);

  const handleStartClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(`/run/training/post/${postId}/code`, {}, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.isSuccess) {
        setCode(response.data.result.code);
        setIsModalOpen(true);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("출석 코드 생성에 실패했습니다.");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleModalStartClick = () => {
    if (!code) return;
    setIsFinished(true);
    setIsModalOpen(false);


  };



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


  // 말풍선 외부를 클릭했을 때 숨기기
  const handleOutsideClick = (event: React.MouseEvent) => {
    if (!event.target.closest('.tooltip-container') && isTooltipVisible) {
      setIsTooltipVisible(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
        훈련
      </div>

      <div className="relative w-[375px] pb-[90px]">
        <object data={postImageUrl || flashrunimage} className="w-[375px] h-[308px]" />
        <div className="absolute top-[230px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[14px]">
            <div className="relative flex items-center bg-[#FFC002] p-[10px] text-[14px] w-auto h-[24px] rounded-[8px]">
              <div className="flex items-center font-bold">
                <span>{trainingtype}</span> {/* trainingtype 텍스트 */}
              </div>

              {/* 물음표 아이콘을 고정된 위치에 배치 */}
              <img
                src={isHovered ? questionmarkOn : questionmarkOff}
                alt="question mark"
                className="ml-2 cursor-pointer absolute top-0 left-[calc(358%+10px)]" // 물음표 아이콘을 오른쪽에 고정
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsTooltipVisible(!isTooltipVisible)}
              />

              {/* 말풍선 위치 고정 */}
              {isTooltipVisible && (
                <div className="absolute left-[calc(5%+10px)] top-[calc(-400%)] mt-2 bg-[#F5F5F5] pt-[13.5px] pl-[16px] pr-[16px] pb-[13.5px] rounded-tl-lg rounded-tr-lg rounded-bl-lg w-[186px] text-left text-sm">
                  <div className="text-[#4F3F3F] text-[12px]">{getTrainingDescription(trainingtype)}</div>
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
          )}
          <div className="flex flex-col mt-2 items-start text-left w-full max-w-[327px]">세부 내용</div>
          <div className="mt-2 w-[327px] border border-[#ECEBE4] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#844E4E] text-white text-xs flex items-center justify-center font-bold leading-none">
                {postCreatorName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-black">{postCreatorName}</span>
            </div>

            <div className="text-[#686F75] p-3 text-sm text-justify whitespace-pre-wrap">{content}</div>
          </div>
        </>
      )}

      {activeTab === "명단" && <AttendanceList users={participants} />}

      <CommentSection postId={postId!} userInfo={userInfo} />

      {/* 시작하기 버튼 */}
      <button
        className={`flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mt-20 mb-2 ${isFinished
          ? "bg-[#ECEBE4] text-[#757575] cursor-not-allowed"
          : "bg-[#366943] text-white"
          }`}
        onClick={handleStartClick}
        disabled={isFinished}
      >
        {buttonText}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-5 rounded-lg w-[280px] text-center relative">
            <button
              className="absolute top-2.5 right-2.5 text-2xl cursor-pointer"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h2>참여 코드가 생성되었습니다.</h2>
            <input
              type="text"
              className="w-full p-2 border-b border-gray-300 text-center text-lg mt-5"
              value={code}
              disabled
            />
            <div className="flex justify-between mt-5 gap-2">
              <button
                className="w-full py-3 rounded-lg bg-[#366943] text-white text-lg"
                onClick={handleModalStartClick}
              >
                종료하기
              </button>
              <button
                className="w-full py-3 rounded-lg bg-gray-300 text-gray-700"
                onClick={handleCloseModal}
              >
                창닫기
              </button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTrainingAdmin;