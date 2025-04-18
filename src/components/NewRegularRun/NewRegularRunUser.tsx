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

const NewRegularRunUser: React.FC<FlashRunUserData> = ({ postId }) => {
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
  const [postCreatorName, setPostCreatorName] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/regular/post/${postId}`, {
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
            userName: ㅇㅁㅅresult.userInfo?.userName || "",
            userProfileImg: result.userInfo?.userProfileImg || "",
          });
          setPostCreatorName(result.postCreatorInfo.userName)
          setPostCreatorImg(result.postCreatorInfo.userProfileImg || null);

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
      const response = await customAxios.post(`/run/regular/post/${postId}/join`, {}, {
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
        `/run/regular/post/${postId}/group`,
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
    const utcDate = new Date(iso);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  
    const month = kstDate.getMonth() + 1;
    const day = kstDate.getDate();
    const hours = kstDate.getHours().toString().padStart(2, "0");
    const minutes = kstDate.getMinutes().toString().padStart(2, "0");
  
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const handleTabChange = (tab: "소개" | "명단") => setActiveTab(tab);

  const [postCreatorImg, setPostCreatorImg] = useState<string | null>(null);


  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      <div className="relative flex bg-kuDarkGreen w-[430px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
        정규런
      </div>

      <div className="relative w-[375px] pb-[90px]">
        <object data={postImageUrl || flashrunimage} className="w-[375px] h-[308px]" />
        <div className="absolute top-[230px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[14px]">
            <object data={RegularRunlogo} className="w-[60px] h-[24px]"/>
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
          <div className="mt-2 w-[327px] border border-[#ECEBE4] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {postCreatorImg ? (
                <img
                  src={postCreatorImg}
                  alt={`${postCreatorName} 프로필`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#844E4E] text-white text-xs flex items-center justify-center font-bold leading-none">
                  {postCreatorName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-black">{postCreatorName}</span>
            </div>
            <div className="text-[#686F75] p-3 text-sm text-justify whitespace-pre-wrap">{content}</div>
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

export default NewRegularRunUser;