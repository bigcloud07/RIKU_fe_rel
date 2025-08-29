import React, { useState, useEffect, useRef } from "react";
import FlashRunlogo from "../../assets/FlashRunDetail/flashrunlogo.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import TabButton from "./TapButton";

import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg"; // 번개런 기본이미지
import BackBtnimg from "../../assets/BackBtn.svg"
import pacermark from "../../assets/pacer-mark.svg"
import CommentSection from "../common/CommentSection";
import EditableAttendanceList from "./EditableAttendanceList"
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

import TabNavigationUI_detail from "../TabNavigationUI_detail";

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

interface EditableUser {
  userId: number;
  userName: string;
  userProfileImg?: string | null;
  status: "ATTENDED" | "PENDING";
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
  const [currentParticipantsNum, setCurrentParticipantsNum] = useState<number>(participantsNum); // 현재 불러오는 값
  const [postCreatorName, setPostCreatorName] = useState("");



  const [editableParticipants, setEditableParticipants] = useState<EditableUser[]>([]);




  const navigate = useNavigate()
  const handleBack = () => navigate(-1);





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
  const confirmClose = window.confirm("정말 출석을 종료하시겠습니까?");
  if (!confirmClose) return;

  if (!code) return;

  try {
    const token = JSON.parse(localStorage.getItem("accessToken") || "null");
    
    // 출석 데이터 준비
    const attendanceData = editableParticipants.map((user) => ({
      userId: user.userId,
      isAttend: user.status === "ATTENDED",
    }));

    //  출석 상태 먼저 반영
    await customAxios.patch(
      `/run/flash/post/${postId}/manual-attendance`,
      attendanceData,
      {
        headers: { Authorization: `${token}` },
      }
    );

    //  출석 종료 처리
    const response = await customAxios.patch(
      `/run/flash/post/${postId}/close`,
      {},
      {
        headers: { Authorization: `${token}` },
      }
    );

    if (response.data.isSuccess) {
      setIsFinished(true);
      setPostStatus("CLOSED");
      setIsModalOpen(false);
      alert("출석이 종료되었습니다.");
    } else {
      setError(response.data.responseMessage);
    }
  } catch (error) {
    console.error(error);
    setError("출석 종료 처리에 실패했습니다.");
  }
};



  const handleCloseModal = () => setIsModalOpen(false);

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
        setPostStatus(result.postStatus);
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
          const converted = result.participants.map((p: any) => ({
            userId: p.userId,
            userName: p.userName,
            userProfileImg: p.userProfileImg || null,
            status: p.status === "ATTENDED" ? "ATTENDED" : "PENDING",
          }));
          setEditableParticipants(converted);
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

  useEffect(() => {
    if (participants.length > 0) {
      const converted = participants.map((p) => ({
        userId: p.id,
        userName: p.name,
        userProfileImg: p.profileImage || null,
        status: p.isPresent ? "ATTENDED" : "PENDING",
      }));
      setEditableParticipants(converted);
    }
  }, [postId, participants]);



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
          setPostCreatorImg(result.postCreatorInfo.userProfileImg || null);
          setPostCreatorName(result.postCreatorInfo.userName);


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
    const utcDate = new Date(iso);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

    const month = kstDate.getMonth() + 1;
    const day = kstDate.getDate();
    const hours = kstDate.getHours().toString().padStart(2, "0");
    const minutes = kstDate.getMinutes().toString().padStart(2, "0");

    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const [postCreatorImg, setPostCreatorImg] = useState<string | null>(null);

  // 상단바 점 버튼 관련 코드
  const [showMenu, setShowMenu] = useState(false); // 메뉴 열림 상태 추가
  const menuRef = useRef<HTMLDivElement>(null);
  const dotButtonRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        dotButtonRef.current &&
        !dotButtonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);




  return (
    <div className="w-full min-h-screen overflow-y-auto bg-white">
      <div className="w-full max-w-[430px] mx-auto flex flex-col items-center text-center justify-center">
        {/* 상단바 */}
        <div className="relative flex bg-kuDarkGreen w-full h-[56px] text-white text-xl font-semibold justify-center items-center">
          <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
          번개런
          <div
            ref={dotButtonRef}
            className="absolute right-[5px] top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              setShowMenu((prev) => !prev);
            }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-y-[4px]">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="w-[4px] h-[4px] bg-white rounded-full" />
              ))}
            </div>
          </div>

          {showMenu && (
            <motion.div
              ref={menuRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {},
                exit: {},
              }}
              className="absolute top-[50px] right-[18px] z-20 flex flex-col gap-y-2"
            >
              {["수정하기", "취소하기"].map((label, index) => (
                <motion.button
                  key={label}
                  custom={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 * index, duration: 0.2 }}
                  className="w-[100px] py-2 px-3 rounded-tl-xl rounded-b-xl bg-white shadow-md text-black text-sm"
                  onClick={async () => {
                    if (label === "수정하기") {
                      if (postStatus === "CLOSED" || postStatus === "CANCELED") {
                        alert("종료된 러닝이나 취소된 러닝은 수정이 불가능합니다.");
                        return;
                      }

                      // 정확한 비교 로직
                      const now = new Date();

                      const runUtcDate = new Date(date); // 서버에서 받은 UTC 기준 date
                      const runKstDate = new Date(runUtcDate.getTime() + 9 * 60 * 60 * 1000); // 🔥 KST로 변환

                      if (now > runKstDate) {
                        alert("집합 시간이 지난 게시글은 수정할 수 없습니다.");
                        return;
                      }

                      navigate(`/flash/edit/${postId}`, { replace: true });
                      setShowMenu(false);
                    } else {
                      if (postStatus === "CLOSED" || postStatus === "CANCELED") {
                        alert("이미 종료되었거나 취소된 게시글은 취소할 수 없습니다.");
                        return;
                      }

                      const confirmCancel = window.confirm("정말 게시글을 취소하시겠습니까?");
                      if (!confirmCancel) return;

                      try {
                        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
                        if (!token) {
                          alert("로그인이 필요합니다.");
                          return;
                        }

                        const { data } = await customAxios.patch(
                          `/run/flash/post/${postId}/cancel`,
                          {},
                          {
                            headers: {
                              Authorization: `${token}`,
                            },
                          }
                        );

                        if (data.isSuccess) {
                          alert("게시글이 성공적으로 취소되었습니다.");
                          setShowMenu(false);
                          navigate("/FlashRun");
                        } else {
                          alert(data.responseMessage || "취소에 실패했습니다.");
                        }
                      } catch (error) {
                        console.error(error);
                        alert("요청 중 오류가 발생했습니다.");
                      }
                    }
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}

        </div>
        {/* 러닝 포스팅 사진 */}
        <div className="relative w-full max-w-[430px] pb-[10px]">
          <div className="relative w-full overflow-hidden">
            <img
              src={postimgurl || flashrunimage}
              className={`w-full h-[308px] object-cover transition-all duration-300 ${showMenu || postStatus === "CANCELED" || postStatus === "CLOSED" ? "brightness-75" : ""
                }`}
            />
            {(postStatus === "CANCELED" || postStatus === "CLOSED") && (
              <div className="absolute inset-0 flex justify-center items-center bg-opacity-40 bg-black">
                <div className="text-white text-lg font-bold bg-opacity-60 px-4 py-2 mb-10 rounded">
                  {postStatus === "CANCELED" ? "취소된 러닝입니다." : "마감된 러닝입니다."}
                </div>
              </div>
            )}
          </div>
          {/* 번개런 정보 */}
          <div className="absolute top-[234px] w-full px-5 rounded-t-[20px] bg-white">
            <div className="flex flex-col items-center mt-[14px]">
              <object data={FlashRunlogo} className="w-[60px] h-[24px]" />
              <div className="text-lg font-semibold mt-2 text-[24px]">{title}</div>
            </div>
            <div className="flex flex-col items-start w-full max-w-[360px] mt-[15px] ">
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
                <span className="font-bold text-kuDarkGreen">{currentParticipantsNum}</span>
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
            <div className="flex justify-center items-center w-full max-w-[320px] h-14 bg-[#F0F4DD] rounded-lg text-sm font-normal mt-5">
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
              <div className="mt-5 w-full max-w-[320px]">
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
                          <div className="w-full h-[300px] overflow-hidden">
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
            <div className="flex flex-col items-start text-left w-full max-w-[327px] mt-2">세부 내용</div>
            <div className="mt-1 w-[327px] border border-[#ECEBE4] rounded-lg p-4">
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
              <div className="text-black p-3 text-sm text-left whitespace-pre-wrap">{content}</div>
            </div>
          </>
        )}
        {activeTab === "명단" && <EditableAttendanceList
          postId={postId!}
          runType="flash"
          users={editableParticipants}
          onUsersChange={setEditableParticipants}
          canEdit={true} // 관리자용이므로 무조건 true
          postStatus={postStatus}
          postDate={date}
        />}
        <CommentSection postId={postId!} postType="flash" userInfo={userInfo} refreshTrigger={refreshComments} />



        {/* 시작하기 버튼 */}
        <button
          className={`flex justify-center items-center w-[327px] h-14 rounded-lg text-lg font-bold mt-20 mb-[100px] ${isFinished || postStatus === "CLOSED"
            ? "bg-[#ECEBE4] text-[#757575] cursor-not-allowed"
            : "bg-[#366943] text-white"
            }`}
          onClick={handleStartClick}
          disabled={isFinished || postStatus === "CLOSED"}
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
                  출석종료
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
      <TabNavigationUI_detail />
    </div>
  );
};

export default FlashRunAdmin;
