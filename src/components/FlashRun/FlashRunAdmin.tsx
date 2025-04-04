import React, { useState, useEffect } from "react";
import FlashRunlogo from "../../assets/FlashRunDetail/flashrunlogo.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg"; // 번개런 기본이미지
import BackBtnimg from "../../assets/BackBtn.svg"
import pacermark from "../../assets/pacer-mark.svg"
import CommentSection from "./CommentSection";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

interface Participant {
  id: number;
  name: string;
  profileImage?: string | null;
  isPresent: boolean;
}

interface FlashRunAdminData {
  title: string;
  location: string;
  date: string;
  participants: Participant[];
  participantsNum: number;
  content: string;
  userName: string;
  code?: string;
  postId?: string; // 게시글 ID 추가
  postimgurl: string
}

const FlashRunAdmin: React.FC<FlashRunAdminData> = ({
  title,
  location,
  
  participants,
  participantsNum,
  content,
  userName,
  postId,
  postimgurl
}) => {
  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("시작하기");
  const [code, setCode] = useState(""); // 출석 코드
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(participants);
  const [date, setDate] = useState("");
  const navigate = useNavigate()

  

  const handleStartClick = async () => {
    if (!code) {
      try {
        // 출석 코드 생성 API 호출
        const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
        const response = await customAxios.post(
          `/run/flash/post/${postId}/code`,
          {},
          {
            headers: {
              Authorization: `${token}`, // 적절한 토큰으로 교체
            },
          }
        );
        console.log(response.data)
        if (response.data.isSuccess) {
          const generatedCode = response.data.result.code;
          setCode(generatedCode);
          setIsInputDisabled(true);
          setError(null); // 에러 초기화
        } else {
          setError(response.data.responseMessage);
        }
      } catch (error: any) {
        setError("출석 코드를 생성할 수 없습니다. 다시 시도해주세요.");
      }
    }

    setIsModalOpen(true);
  };

  const [postStatus, setPostStatus] = useState<string>("");
  const handleModalStartClick = async () => {
    if (!code) return;
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.patch(`/run/flash/post/${postId}/close`, {}, {
        headers: { Authorization: `${token}` },
      });

      if (response.data.isSuccess) {
        setIsFinished(true); // 버튼 비활성화 처리
        setPostStatus("CLOSED");
        setIsModalOpen(false);
        alert("출석이 종료되었습니다.");
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error) {
      setError("출석 종료 처리에 실패했습니다.");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleTabChange = async (tab: "소개" | "명단") => { //명단 탭누를때 마다 명단 사람들의 상태 최신화
    setActiveTab(tab);
    if (tab === "명단") {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/flash/post/${postId}`, {
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

  const [userInfo, setUserInfo] = useState<{ userId: number; userName: string; userProfileImg: string }>({
    userId: 0,
    userName: "",
    userProfileImg: "",
  });

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [creatorName, setCreatorName] = useState(""); // 작성자 이름

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/flash/post/${postId}`, {
          headers: { Authorization: `${token}` },
        });
        if (response.data.isSuccess) {
          const result = response.data.result;
          setAttachmentUrls(result.attachmentUrls || []);
          setCreatorName(result.postCreatorInfo?.userName || "");
          setPostStatus(result.postStatus);
          setUserInfo({
            userId: result.userInfo?.userId || 0,
            userName: result.userInfo?.userName || "",
            userProfileImg: result.userInfo?.userProfileImg || "",
          });
          setDate(result.date);
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
    const minutes = dateObj.getMinutes().toString().padStart(2, "0"); // 분 추가
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };
  


  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      {/* 상단바 */}
      <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={() => navigate("/FlashRun")} ></img>
        번개런
      </div>
      {/* 러닝 포스팅 사진 */}
      <div className="relative w-[375px] pb-[50px]">
        <object data={postimgurl || flashrunimage} className="w-[375px] h-[250px]" />
        {/* 번개런 정보 */}
        <div className="absolute top-[220px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[14px]">
            <object data={FlashRunlogo} />
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
              <object data={people} className="font-bold text-kuDarkGreen w-[24px] h-[24px] mr-2" />
              <span className="font-bold text-kuDarkGreen">{participantsNum}</span>
            </div>
          </div>
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
              <div className="flex justify-center items-center bg-kuBlue w-6 h-6 rounded-full relative mr-2">
                <span className="text-white text-xs font-bold">
                  <span className="text-white text-xs font-bold">
                    {creatorName && creatorName.length > 1 ? creatorName.charAt(0) : creatorName?.charAt(0) || "?"}
                  </span>
                  <div className="absolute top-[-15px] left-[-19px] w-[32.78px] h-[32px]"><img src={pacermark} /></div>
                </span>
              </div>
              {creatorName}
            </div>

          </div>
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
          <div className="flex flex-col items-start text-left w-full max-w-[327px] mt-3">세부 내용</div>
          <div className="mt-1 w-[327px] border border-[#ECEBE4] rounded-lg">
            <div className="text-[#686F75] p-5 text-justify">{content}</div>
          </div>
        </>
      )}
      {activeTab === "명단" && <AttendanceList users={currentParticipants} />}
      <CommentSection postId={postId!} userInfo={userInfo} />



      {/* 시작하기 버튼 */}
      <button
        className={`flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mt-20 mb-2 ${isFinished || postStatus === "CLOSED"
          ? "bg-[#ECEBE4] text-[#757575] cursor-not-allowed"
          : "bg-[#366943] text-white"
          }`}
        onClick={handleStartClick}
        disabled={isFinished || postStatus === "CLOSED"}
      >
        {buttonText}
      </button>
      {/* 수정하기 버튼 */}
      <button
        className="flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mb-4 bg-[#4D4D4D] text-white"
        onClick={() => navigate(`/flash/edit/${postId}`)}
      >
        수정하기
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

export default FlashRunAdmin;
