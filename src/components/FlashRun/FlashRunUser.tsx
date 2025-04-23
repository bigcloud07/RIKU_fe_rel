import React, { useState, useEffect } from "react";
import FlashRunlogo from "../../assets/FlashRunDetail/flashrunlogo.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg"; // 번개런 기본이미지
import { Link, useNavigate } from "react-router-dom";
import BackBtnimg from "../../assets/BackBtn.svg"
import pacermark from "../../assets/pacer-mark.svg"
import CommentSection from "./CommentSection";

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
  attachmentUrls?: string[];
}

const FlashRunUser: React.FC<FlashRunUserData> = ({
  title,
  location,

  participants,
  participantsNum,
  content,
  userName,
  postId,
  postimgurl,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [code, setCode] = useState(""); // 출석 코드
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(participants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [buttonText, setButtonText] = useState("참여하기");
  const [userStatus, setUserStatus] = useState("");
  const [date, setDate] = useState("")
  const [currentParticipantsNum, setCurrentParticipantsNum] = useState<number>(participantsNum); // 현재 불러오는 값






  const handleStartClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.patch(
        `/run/flash/post/${postId}/join`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      if (response.data.isSuccess) {
        const newStatus = response.data.result.status; // ✅ API에서 받은 상태값 사용
        setUserStatus(newStatus); // 상태 업데이트
        setButtonText(newStatus === "PENDING" ? "출석하기" : "참여하기"); // 상태에 맞는 버튼 텍스트 설정
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error) {
      setError("러닝 참여에 실패했습니다.");
    }
  };
  


  const handleOpenAttendanceModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleAttendanceClick = async () => {
    if (!code.trim()) {
      setError("출석 코드를 입력해주세요.");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.patch(
        `/run/flash/post/${postId}/attend`, // ✅ attend 엔드포인트로 변경
        { code },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setUserStatus("ATTENDED"); // ✅ 출석 상태로 업데이트
        setButtonText("출석완료");
        setError(null);
        setIsModalOpen(false);
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error) {
      setError("출석 코드를 다시 확인해주세요.");
    }
  };

  const [refreshComments, setRefreshComments] = useState(false);

  const handleTabChange = async (tab: "소개" | "명단") => {
    setActiveTab(tab);
    const token = JSON.parse(localStorage.getItem("accessToken") || "null");

    try {
      const response = await customAxios.get(`/run/flash/post/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.data.isSuccess) {
        const result = response.data.result;

        // 공통 업데이트 (댓글 관련 정보 등)
        setUserInfo({
          userId: result.userInfo?.userId || 0,
          userName: result.userInfo?.userName || "",
          userProfileImg: result.userInfo?.userProfileImg || "",
        });
        setPostCreatorImg(result.postCreatorInfo?.userProfileImg || null);
        setCurrentParticipantsNum(result.participantsNum); // 참가자 수 갱신
        setDate(result.date); // 날짜도 혹시 변경되었을 수 있음

        // 탭 별 업데이트
        if (tab === "명단") {
          setCurrentParticipants(result.participants);
        }

        if (tab === "소개") {
          setAttachmentUrls(result.attachmentUrls || []);
          setCreatorName(result.postCreatorInfo?.userName || "");
        }

        // ✅ 댓글 최신화 트리거
        setRefreshComments((prev) => !prev);
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error) {
      setError("데이터를 불러오는 데 실패했습니다.");
    }
  };

  const [userInfo, setUserInfo] = useState<{ userId: number; userName: string; userProfileImg: string }>({
    userId: 0,
    userName: "",
    userProfileImg: "",
  });

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/flash/post/${postId}`, {
          headers: { Authorization: `${token}` },
        });
        if (response.data.isSuccess) {
          const result = response.data.result;
  
          setCreatorName(result.postCreatorInfo?.userName || "");
          setAttachmentUrls(result.attachmentUrls || []);
          setUserInfo({
            userId: result.userInfo?.userId || 0,
            userName: result.userInfo?.userName || "",
            userProfileImg: result.userInfo?.userProfileImg || "",
          });
          setDate(result.date);
          setPostCreatorImg(result.postCreatorInfo.userProfileImg || null);
          setPostCreatorName(result.postCreatorInfo.userName);
          
          // 🔥 로그인된 사용자의 참가 상태 찾기
          const currentUser = result.participants.find(
            (participant: any) => participant.userId === result.userInfo.userId
          );
  
          if (currentUser) {
            setUserStatus(currentUser.status);
            setButtonText(
              currentUser.status === "ATTENDED"
                ? "출석완료"
                : currentUser.status === "PENDING"
                  ? "출석하기"
                  : "참여하기"
            );
          } else {
            setUserStatus("");
            setButtonText("참여하기");
          }
  
        } else {
          setError(response.data.responseMessage);
        }
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };
  
    fetchPostData();
  }, [postId]);
  

  const [creatorName, setCreatorName] = useState(""); // 작성자 이름
  const [postCreatorName, setPostCreatorName] = useState("");



  const formatDateTime = (iso: string) => {
    const utcDate = new Date(iso);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

    const month = kstDate.getMonth() + 1;
    const day = kstDate.getDate();
    const hours = kstDate.getHours().toString().padStart(2, "0");
    const minutes = kstDate.getMinutes().toString().padStart(2, "0");

    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const [postCreatorImg, setPostCreatorImg] = useState<string | null>(null);

  const handleCancelParticipation = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.patch(
        `/run/flash/post/${postId}/join`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setUserStatus(""); // ✅ 초기 상태로 설정
        setButtonText("참여하기");
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch (error) {
      setError("참여 취소 요청에 실패했습니다.");
    }
  };





  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      {/* 상단바 */}
      <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px]" onClick={() => navigate("/FlashRun")}></img>
        번개런
      </div>
      {/* 러닝 포스팅 사진 */}
      <div className="relative w-[375px] pb-[50px]">
        <div className="w-[375px] h-[250px] overflow-hidden">
          <object data={postimgurl || flashrunimage} className="w-full h-full object-cover" />
        </div>
        {/* 번개런 정보 */}
        <div className="absolute top-[230px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[14px]">
            <object data={FlashRunlogo} className="w-[60px] h-[24px]" />
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
              <object data={people} className="w-[24px] h-[24px] mr-2 font-bold font-#366943" />
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
          <div className="flex justify-center items-center w-[327px] h-14 bg-[#F0F4DD] rounded-lg text-sm font-normal mt-[20px]">
            <div className="flex items-center">
              <div className="relative w-6 h-6 mr-2">
                {postCreatorImg && postCreatorImg.trim() !== "" ? (
                  <img
                    src={postCreatorImg}
                    alt={`${creatorName} 프로필`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-kuBlue text-white text-xs font-bold flex items-center justify-center">
                    {creatorName?.charAt(0) || "?"}
                  </div>
                )}
                <div className="absolute top-[-15px] left-[-19px] w-[32.78px] h-[32px]">
                  <img src={pacermark} alt="pacer mark" />
                </div>
              </div>
              <span className="text-black font-semibold">{creatorName}</span>
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
                      <div className="w-[400px] h-[300px] overflow-hidden">
                          <img
                            src={url}
                            alt={`코스 사진 ${index + 1}`}
                            className="rounded-lg w-full h-full object-cover"
                          />
                        </div>
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
          <div className="flex flex-col items-start text-left w-full max-w-[327px] mt-[8px]">세부 내용</div>
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
            <div className="mt-[8px] text-[#686F75] p-3 text-sm text-justify whitespace-pre-wrap">{content}</div>
          </div>
        </>
      )}
      {activeTab === "명단" && <AttendanceList users={currentParticipants} />}
      <CommentSection postId={postId!} userInfo={userInfo} refreshTrigger={refreshComments} />

      {userStatus === "PENDING" && (
        <div className="flex justify-center mt-20 mb-2">
          <div className="w-[327px] flex gap-2">
            <button
              className="w-1/2 h-14 rounded-lg bg-[#ECEBE4] text-[#757575] font-bold"
              onClick={handleCancelParticipation}
            >
              참여 취소
            </button>
            <button
              className="w-1/2 h-14 rounded-lg bg-kuDarkGreen text-white font-bold"
              onClick={handleOpenAttendanceModal}
            >
              출석하기
            </button>
          </div>
        </div>
      )}

      {userStatus === "" && (
        <button
          className="flex justify-center items-center w-[327px] h-14 rounded-lg bg-kuGreen text-white text-lg font-bold mt-20 mb-2"
          onClick={handleStartClick}
        >
          참여하기
        </button>
      )}

      {userStatus === "ATTENDED" && (
        <button
          className="flex justify-center items-center w-[327px] h-14 rounded-lg bg-[#ECEBE4] text-[#757575] text-lg font-bold mt-20 mb-2 cursor-not-allowed"
          disabled
        >
          출석완료
        </button>
      )}


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
